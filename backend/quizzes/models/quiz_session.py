from datetime import timedelta

from django.db.models import (
    CASCADE,
    SET_NULL,
    CharField,
    DateTimeField,
    ForeignKey,
    PositiveIntegerField,
    SlugField,
    Sum,
    URLField,
)
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django_fsm import FSMField, transition
from djchoices import ChoiceItem, DjangoChoices
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel


class QuizSession(TimeStampedModel, SealableModel, HashidModel):
    class Status(DjangoChoices):
        draft = ChoiceItem("draft")
        live = ChoiceItem("live")
        show_leaderboard = ChoiceItem("show-leaderboard")
        complete = ChoiceItem("complete")

    name = CharField(_("name"), max_length=100, blank=True, default="")
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
    current_question_changed = DateTimeField(
        _("current question changed at"),
        null=True,
        blank=True,
        help_text=_(
            "Users have 'seconds_to_answer_question' seconds from this datetime to answer the question"
        ),
    )
    seconds_to_answer_question = PositiveIntegerField(
        _("seconds to answer question"), default=30,
    )

    stream_link = URLField(
        _("stream link"), help_text=_("Link used for the bottom bar in the quiz")
    )

    @property
    def is_showing_leaderboard(self):
        return self.status in (
            QuizSession.Status.show_leaderboard,
            QuizSession.Status.complete,
        )

    @property
    def is_live(self):
        return self.status == QuizSession.Status.live

    @property
    def is_finished(self):
        return self.status == QuizSession.Status.complete

    @transition(
        status,
        source=[Status.draft, Status.live, Status.show_leaderboard],
        target=Status.live,
    )
    def show_next_question(self):
        self.current_question = self.next_question
        self.current_question_changed = timezone.now()

    @transition(status, source=Status.live, target=Status.show_leaderboard)
    def show_leaderboard(self):
        pass

    @transition(status, source="*", target=Status.complete)
    def end(self):
        pass

    @property
    def can_answer_question(self):
        if not self.current_question_changed:
            return False

        current_time = timezone.now()
        time_since_question_change = timezone.now() - self.current_question_changed

        return time_since_question_change <= timedelta(
            seconds=self.seconds_to_answer_question
        )

    @property
    def next_question(self):
        current_question = self.current_question

        if not current_question:
            return self.quiz.questions.first()

        next_question = self.quiz.questions.filter(
            position__gt=current_question.position
        ).first()

        return next_question

    def __str__(self):
        return f"{self.name} {self.quiz.name}".strip()

    class Meta:
        verbose_name = _("quiz session")
        verbose_name_plural = _("quiz sessions")
