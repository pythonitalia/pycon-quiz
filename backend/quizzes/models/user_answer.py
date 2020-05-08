from django.conf import settings
from django.db.models import CharField, SlugField, ForeignKey, CASCADE, SET_NULL
from django.utils.translation import ugettext_lazy as _

from model_utils.models import TimeStampedModel


class UserAnswer(TimeStampedModel):
    session = ForeignKey(
        "quizzes.QuizSession", on_delete=CASCADE, related_name="users_answers"
    )
    partecipant = ForeignKey(
        "quizzes.Partecipant", on_delete=CASCADE, related_name="answers"
    )
    question = ForeignKey("quizzes.Question", on_delete=CASCADE)
    answer = ForeignKey("quizzes.Answer", on_delete=CASCADE)

    class Meta:
        verbose_name = _("user answer")
        verbose_name_plural = _("user answers")
        unique_together = ("session", "partecipant", "question")
