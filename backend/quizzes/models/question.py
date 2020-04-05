from django.db.models import CharField, ForeignKey, CASCADE, PositiveIntegerField

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _


class Question(TimeStampedModel):
    quiz = ForeignKey(
        "quizzes.Quiz",
        on_delete=CASCADE,
        verbose_name=_("quiz"),
        related_name="questions",
    )

    text = CharField(_("text"), max_length=1000)
    position = PositiveIntegerField(_("position"), blank=True)

    def __str__(self):
        return f"#{self.position}: {self.text}"

    class Meta:
        verbose_name = _("question")
        verbose_name_plural = _("questions")
        ordering = [
            "position",
        ]
