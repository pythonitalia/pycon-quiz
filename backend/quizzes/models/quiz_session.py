from django.db.models import CharField, SlugField, ForeignKey, CASCADE, SET_NULL

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _

from django_fsm import FSMField, transition
from djchoices import DjangoChoices, ChoiceItem


class QuizSession(TimeStampedModel):
    class Status(DjangoChoices):
        draft = ChoiceItem("draft")
        live = ChoiceItem("live")
        complete = ChoiceItem("complete")

    name = CharField(_("name"), max_length=1000)
    quiz = ForeignKey(
        "quizzes.Quiz",
        on_delete=CASCADE,
        verbose_name=_("quiz"),
        related_name="sessions",
    )
    status = FSMField(_("status"), default=Status.draft)

    current_question = ForeignKey(
        "quizzes.Question",
        on_delete=SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("current question"),
    )

    @property
    def is_live(self):
        return self.status == QuizSession.Status.live

    @transition(status, source=Status.draft, target=Status.live)
    def go_live(self):
        self.current_question = self.quiz.questions.first()

    @transition(status, source=Status.live, target=Status.complete)
    def end(self):
        pass

    @property
    def next_question(self):
        current_question = self.current_question

        if not current_question:
            return self.quiz.questions.first()

        next_question = self.quiz.questions.filter(
            position__gt=current_question.position
        ).first()

        return next_question

    class Meta:
        verbose_name = _("quiz session")
        verbose_name_plural = _("quiz sessions")
