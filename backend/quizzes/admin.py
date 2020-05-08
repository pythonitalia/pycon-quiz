import nested_admin
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.utils.html import mark_safe
from quizzes.models import Quiz, QuizSession, Question, Answer, UserAnswer, Partecipant
from django.urls import path, reverse
from django.shortcuts import redirect

from django_object_actions import DjangoObjectActions

from game_manager.actions import go_live, end, go_to_next_question


class AnswerInline(nested_admin.NestedStackedInline):
    model = Answer
    sortable_field_name = "position"
    extra = 0


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    inlines = [AnswerInline]
    sortable_field_name = "position"
    extra = 0


@admin.register(Quiz)
class QuizAdmin(DjangoObjectActions, nested_admin.NestedModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    change_actions = ("create_session",)
    inlines = [
        QuestionInline,
    ]

    def create_session(self, request, obj):
        session = obj.create_session()
        new_session_url_admin_url = reverse(
            "admin:quizzes_quizsession_change", args=[session.id]
        )
        return redirect(new_session_url_admin_url)

    create_session.label = _("Create session")
    create_session.short_description = _("Create session")


@admin.register(QuizSession)
class QuizSessionAdmin(admin.ModelAdmin):
    fieldsets = (
        (_("Generic"), {"fields": ("name", "quiz", "status",)}),
        (
            _("Progress"),
            {
                "fields": (
                    "current_question",
                    "current_question_answer",
                    "next_question",
                )
            },
        ),
        (
            _("Game Manager"),
            {"fields": ("start_quiz", "go_to_next_question", "end_quiz")},
        ),
    )
    readonly_fields = (
        "status",
        "quiz",
        "current_question_answer",
        "next_question",
        "start_quiz",
        "go_to_next_question",
        "end_quiz",
    )

    def current_question_answer(self, obj: QuizSession):
        current_question = obj.current_question

        if not current_question:
            return None

        return current_question.answers.filter(is_correct=True).first().text

    def start_quiz(self, obj):
        return _render_button(
            _("Start quiz"), url=_get_url_to_action("start_quiz", obj.id)
        )

    def go_to_next_question(self, obj):
        return _render_button(
            _("Go to next question"), url=_get_url_to_action("next_question", obj.id)
        )

    def end_quiz(self, obj):
        return _render_button(_("End quiz"), url=_get_url_to_action("end_quiz", obj.id))

    def start_quiz_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        go_live(session)
        return _redirect_back_to_changeview(object_id)

    def next_question_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        go_to_next_question(session)
        return _redirect_back_to_changeview(object_id)

    def end_quiz_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        end(session)
        return _redirect_back_to_changeview(object_id)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:object_id>/start-quiz/",
                self.admin_site.admin_view(self.start_quiz_view),
                name="start_quiz",
            ),
            path(
                "<int:object_id>/next-question/",
                self.admin_site.admin_view(self.next_question_view),
                name="next_question",
            ),
            path(
                "<int:object_id>/end-quiz/",
                self.admin_site.admin_view(self.end_quiz_view),
                name="end_quiz",
            ),
        ]
        return custom_urls + urls


def _get_url_to_action(action: str, id: int):
    return reverse(f"admin:{action}", args=[id])


def _redirect_back_to_changeview(object_id: int):
    return redirect(reverse("admin:quizzes_quizsession_change", args=[object_id]))


def _render_button(label, url="#"):
    return mark_safe(
        f"""
    <a class="button" href="{url}">{label}</a>
    """
    )


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    pass


@admin.register(Partecipant)
class PartecipantAdmin(admin.ModelAdmin):
    pass
