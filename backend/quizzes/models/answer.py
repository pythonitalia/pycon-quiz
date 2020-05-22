from django.db.models import (
    CASCADE,
    BooleanField,
    CharField,
    ForeignKey,
    ImageField,
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

    text = CharField(_("text"), blank=True, default="", max_length=1000)
    image = ImageField(
        _("image"),
        null=True,
        blank=True,
        help_text=_(
            "If provided, it will be used instead of the text. Please provide a text description for accessibility reasons"
        ),
    )
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
