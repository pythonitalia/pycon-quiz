import binascii
import os

from django.db.models import CASCADE, CharField, ForeignKey
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from seal.models import SealableModel


def generate_key():
    return binascii.hexlify(os.urandom(20)).decode()


class Partecipant(TimeStampedModel, SealableModel):
    name = CharField(_("name"), max_length=50)
    session = ForeignKey(
        "quizzes.QuizSession", on_delete=CASCADE, related_name="partecipants"
    )
    token = CharField(_("token"), max_length=50, default=generate_key)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Partecipant")
        verbose_name_plural = _("Partecipants")
        unique_together = ("name", "session")
