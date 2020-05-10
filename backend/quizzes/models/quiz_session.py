from django.db.models import (
    CASCADE,
    SET_NULL,
    CharField,
    Count,
    ForeignKey,
    Q,
    SlugField,
    Sum,
)
from django.utils.translation import ugettext_lazy as _
from django_fsm import FSMField, transition
from djchoices import ChoiceItem, DjangoChoices
from model_utils.models import TimeStampedModel
from seal.models import SealableModel


class QuizSession(TimeStampedModel, SealableModel):
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

    @property
    def is_finished(self):
        return self.status == QuizSession.Status.complete

    @transition(status, source=Status.draft, target=Status.live)
    def go_live(self):
        self.current_question = self.quiz.questions.first()

    @transition(status, source=Status.live, target=Status.complete)
    def end(self):
        pass

    @property
    def leaderboard(self):
        return self.partecipants.annotate(
            tot_answers=Count("answers"),
            score=Count("answers", filter=Q(answers__answer__is_correct=True)),
        ).order_by("score")

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
