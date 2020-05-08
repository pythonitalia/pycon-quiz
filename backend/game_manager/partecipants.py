from typing import TYPE_CHECKING

from game_manager.exceptions import PartecipantNotFoundError

if TYPE_CHECKING:
    from quizzes.models import Partecipant


def get_partecipant_by_token(token: str) -> "Partecipant":
    from quizzes.models import Partecipant

    try:
        return Partecipant.objects.prefetch_related("answers").get(token=token)
    except Partecipant.DoesNotExist:
        raise PartecipantNotFoundError()
