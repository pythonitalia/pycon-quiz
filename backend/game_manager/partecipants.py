from typing import TYPE_CHECKING

from django.db import IntegrityError

from game_manager.exceptions import PartecipantNotFoundError, UsernameAlreadyUsedError

if TYPE_CHECKING:
    from quizzes.models import Partecipant


def get_partecipant_by_token(token: str) -> "Partecipant":
    from quizzes.models import Partecipant

    try:
        return Partecipant.objects.prefetch_related("answers").get(token=token)
    except Partecipant.DoesNotExist:
        raise PartecipantNotFoundError()


def partecipant_with_name_exists(name: str) -> bool:
    from quizzes.models import Partecipant

    return Partecipant.objects.filter(name__iexact=name).exists()


def register_for_game(*, name: str, color: str, session_id: int) -> str:
    """
    Registers the username in the session_id game and returns the unique token
    associated to him.

    Raises UsernameAlreadyUsedError if the username is already used
    """
    from quizzes.models import Partecipant

    if partecipant_with_name_exists(name):
        raise UsernameAlreadyUsedError("This username is already used by someone else")

    try:
        partecipant = Partecipant.objects.create(
            name=name, color=color, session_id=session_id
        )
        return partecipant.token
    except IntegrityError:
        raise UsernameAlreadyUsedError("This username is already used by someone else")
