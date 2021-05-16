from django.conf import settings
from django.db.models import CASCADE, SET_NULL, CharField, ForeignKey, SlugField
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel


class UserAnswer(TimeStampedModel, SealableModel, HashidModel):
    session = ForeignKey(
        "quizzes.QuizSession", on_delete=CASCADE, related_name="users_answers"
    )
    participant = ForeignKey(
        "quizzes.Participant", on_delete=CASCADE, related_name="answers"
    )
    question = ForeignKey("quizzes.Question", on_delete=CASCADE)
    answer = ForeignKey("quizzes.Answer", on_delete=CASCADE)

    class Meta:
        verbose_name = _("user answer")
        verbose_name_plural = _("user answers")
        unique_together = ("session", "participant", "question")
