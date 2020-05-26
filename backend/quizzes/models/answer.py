from django.db.models import (
    CASCADE,
    BooleanField,
    CharField,
    ForeignKey,
    ImageField,
    PositiveIntegerField,
    TextField,
)
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel


class Answer(TimeStampedModel, SealableModel, HashidModel):
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
    image_width = PositiveIntegerField(_("image width"), null=True, blank=True)
    image_height = PositiveIntegerField(_("image height"), null=True, blank=True)
    image_format = CharField(_("image format"), max_length=10, null=True, blank=True)
    small_image = TextField(_("small image"), null=True, blank=True)

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
