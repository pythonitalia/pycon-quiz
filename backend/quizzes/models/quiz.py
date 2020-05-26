from django.db.models import CharField, SlugField
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from seal.models import SealableModel

from django_hashids.models import HashidModel
from quizzes.models.quiz_session import QuizSession


class Quiz(TimeStampedModel, SealableModel, HashidModel):
    name = CharField(_("name"), max_length=300)
    slug = SlugField(_("slug"))

    def create_session(self) -> QuizSession:
        return QuizSession.objects.create(quiz=self)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("quiz")
        verbose_name_plural = _("quizzes")
