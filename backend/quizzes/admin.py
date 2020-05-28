import re

import nested_admin
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import mark_safe
from django.utils.translation import ugettext_lazy as _
from django_object_actions import DjangoObjectActions

from game_manager.actions import (
    end,
    go_to_next_question,
    send_generic_update,
    set_question_changed_time_to,
    show_leaderboard,
)
from game_manager.session import generate_leaderboard
from quizzes.forms import AnswerInlineForm, QuizSessionForm
from quizzes.models import Answer, Partecipant, Question, Quiz, QuizSession, UserAnswer

QUIZ_SESSION_URL_REGEX = re.compile("\/admin\/quizzes\/quizsession\/([0-9]+)\/")


class AnswerInline(nested_admin.NestedStackedInline):
    model = Answer
    sortable_field_name = "position"
    extra = 0
    form = AnswerInlineForm


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    inlines = [AnswerInline]
    sortable_field_name = "position"
    extra = 0


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    search_fields = ["text"]
    ordering = [
        "position",
    ]

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(
            request, queryset, search_term
        )

        referer = request.headers["referer"]
        result = QUIZ_SESSION_URL_REGEX.search(referer)

        if result:
            quiz_session_id = result[1]
            queryset = self.model.objects.filter(quiz__sessions__id=quiz_session_id)

        return queryset, True


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
    form = QuizSessionForm
    fieldsets = (
        (
            _("Generic"),
            {"fields": ("name", "hashid", "quiz", "status", "stream_link",)},
        ),
        (
            _("Progress"),
            {
                "fields": (
                    "current_question",
                    "current_question_answer",
                    "current_question_points_worth",
                    "next_question",
                    "current_question_changed",
                    "set_question_changed_time_to_now",
                    "seconds_to_answer_question",
                )
            },
        ),
        (
            _("Game Manager"),
            {
                "fields": (
                    "start_quiz",
                    "go_to_next_question",
                    "show_leaderboard",
                    "end_quiz",
                )
            },
        ),
        (_("Leaderboard"), {"fields": ("leaderboard",)}),
    )
    readonly_fields = [
        "quiz",
        "hashid",
        "status",
        "current_question_answer",
        "set_question_changed_time_to_now",
        "current_question_changed",
        "next_question",
        "start_quiz",
        "go_to_next_question",
        "end_quiz",
        "leaderboard",
        "show_leaderboard",
        "current_question_points_worth",
    ]
    list_display = (
        "quiz_name",
        "name",
    )
    list_filter = ("quiz",)
    autocomplete_fields = ["current_question"]

    def has_add_permission(self, request):
        return False

    def quiz_name(self, obj):
        return obj.quiz.name

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .prefetch_related("current_question__answers")
            .select_related("quiz", "current_question")
        )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        send_generic_update(obj)

    def current_question_answer(self, obj: QuizSession):
        current_question = obj.current_question

        if not current_question:
            return None

        return current_question.answers.filter(is_correct=True).first().text

    def current_question_points_worth(self, obj: QuizSession):
        current_question = obj.current_question

        if not current_question:
            return None

        return current_question.points_to_give

    def leaderboard(self, obj):
        return _render_leaderboard(generate_leaderboard(obj))

    def start_quiz(self, obj):
        if not obj.pk:
            return

        if obj.status != QuizSession.Status.draft:
            return _render_message("The event is already live!")

        return _render_button(
            _("Start quiz"), url=_get_url_to_action("start_quiz", obj.id)
        )

    def go_to_next_question(self, obj):
        if not obj.pk:
            return

        if not obj.next_question:
            return _render_message(_("No next question"))

        return _render_button(
            _("Go to next question"), url=_get_url_to_action("next_question", obj.id)
        )

    def end_quiz(self, obj):
        if not obj.pk:
            return

        if obj.status == QuizSession.Status.complete:
            return _render_message(_("Game complete"))

        return _render_button(_("End quiz"), url=_get_url_to_action("end_quiz", obj.id))

    def set_question_changed_time_to_now(self, obj):
        return _render_button(
            _("Set question time to now"),
            url=_get_url_to_action("set_question_changed_time_to_now", obj.id),
        )

    def show_leaderboard(self, obj):
        if not obj.pk:
            return

        if obj.status == QuizSession.Status.show_leaderboard:
            return _render_message("Leaderboard already displaying")

        if obj.status != QuizSession.Status.live:
            return _render_message("Session is not live")

        return _render_button(
            _("Show leaderboard"), url=_get_url_to_action("show_leaderboard", obj.id)
        )

    def start_quiz_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        go_to_next_question(session)
        return _redirect_back_to_changeview(object_id)

    def next_question_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        go_to_next_question(session)
        return _redirect_back_to_changeview(object_id)

    def end_quiz_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        end(session)
        return _redirect_back_to_changeview(object_id)

    def set_question_changed_time_to_now_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        set_question_changed_time_to(session, timezone.now())
        return _redirect_back_to_changeview(object_id)

    def show_leaderboard_view(self, request, object_id: int):
        session: Optional[QuizSession] = self.get_object(request, object_id)
        show_leaderboard(session)
        return _redirect_back_to_changeview(object_id)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:object_id>/actions/start-quiz/",
                self.admin_site.admin_view(self.start_quiz_view),
                name="start_quiz",
            ),
            path(
                "<int:object_id>/actions/next-question/",
                self.admin_site.admin_view(self.next_question_view),
                name="next_question",
            ),
            path(
                "<int:object_id>/actions/show-leaderboard/",
                self.admin_site.admin_view(self.show_leaderboard_view),
                name="show_leaderboard",
            ),
            path(
                "<int:object_id>/actions/end-quiz/",
                self.admin_site.admin_view(self.end_quiz_view),
                name="end_quiz",
            ),
            path(
                "<int:object_id>/actions/set-question-changed-time-to-now/",
                self.admin_site.admin_view(self.set_question_changed_time_to_now_view),
                name="set_question_changed_time_to_now",
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


def _render_message(message):
    return mark_safe(message)


def _render_leaderboard(leaderboard):
    items = "".join(
        [
            f"<li>{partecipant.name}: {partecipant.score} (total answers: {partecipant.tot_answers})</li>"
            for partecipant in leaderboard
        ]
    )

    return mark_safe(
        f"""
    <ul style="margin-left: 0">
        {items}
    </ul>
"""
    )


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    fields = ("session", "partecipant", "question", "answer", "is_correct")
    readonly_fields = ("is_correct",)

    def is_correct(self, obj):
        return obj.answer.is_correct


@admin.register(Partecipant)
class PartecipantAdmin(admin.ModelAdmin):
    pass
