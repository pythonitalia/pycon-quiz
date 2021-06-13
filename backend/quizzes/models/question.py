from django.db.models import (CASCADE, CharField, ForeignKey,
                              PositiveIntegerField, TextField,)
from django.utils.translation import ugettext_lazy as _
from djchoices import ChoiceItem, DjangoChoices
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel


class Question(TimeStampedModel, SealableModel, HashidModel):
    class UIView(DjangoChoices):
        grid = ChoiceItem("grid")
        list = ChoiceItem("list")

    quiz = ForeignKey(
        "quizzes.Quiz",
        on_delete=CASCADE,
        verbose_name=_("quiz"),
        related_name="questions",
    )

    text = TextField(_("text"), max_length=2000)
    position = PositiveIntegerField(_("position"), blank=True)
    ui_view = CharField(
        _("ui view"), choices=UIView.choices, max_length=10, default=UIView.grid
    )
    points_to_give = PositiveIntegerField(
        _('points to give'),
        default=1,
    )

    def __str__(self):
        return f"#{self.position}: {self.text} ({self.quiz.name})"

    class Meta:
        verbose_name = _("question")
        verbose_name_plural = _("questions")
        ordering = [
            "position",
        ]
