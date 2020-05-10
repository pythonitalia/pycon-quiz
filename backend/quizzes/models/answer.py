from django.db.models import (
    CASCADE,
    BooleanField,
    CharField,
    ForeignKey,
    PositiveIntegerField,
)
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel


class Answer(TimeStampedModel):
    question = ForeignKey(
        "quizzes.Question",
        on_delete=CASCADE,
        verbose_name=_("question"),
        related_name="answers",
    )

    text = CharField(_("text"), max_length=1000)
    position = PositiveIntegerField(_("position"), blank=True)
    is_correct = BooleanField(_("is correct"))

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = _("answer")
        verbose_name_plural = _("answers")
        ordering = [
            "position",
        ]
