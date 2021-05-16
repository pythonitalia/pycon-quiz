import binascii
import os

from django.db.models import CASCADE, CharField, ForeignKey
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel


def generate_key():
    return binascii.hexlify(os.urandom(20)).decode()


class Participant(TimeStampedModel, SealableModel, HashidModel):
    name = CharField(_("name"), max_length=50)
    session = ForeignKey(
        "quizzes.QuizSession", on_delete=CASCADE, related_name="participants"
    )
    token = CharField(_("token"), max_length=50, default=generate_key)
    color = CharField(_("color"), max_length=8)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Participant")
        verbose_name_plural = _("Participants")
        unique_together = ("name", "session")
