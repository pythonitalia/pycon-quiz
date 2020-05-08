import binascii
import os

from django.db.models import CharField, ForeignKey, CASCADE

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _


def generate_key():
    return binascii.hexlify(os.urandom(20)).decode()


class Partecipant(TimeStampedModel):
    name = CharField(_("name"), max_length=50)
    session = ForeignKey("quizzes.QuizSession", on_delete=CASCADE)
    token = CharField(_("token"), max_length=50, default=generate_key)

    def __str__(self):
        return _("%(name)s at %(session)s") % {
            "name": self.name,
            "session": self.session.name,
        }

    class Meta:
        verbose_name = _("Partecipant")
        verbose_name_plural = _("Partecipants")
        unique_together = ("name", "session")
