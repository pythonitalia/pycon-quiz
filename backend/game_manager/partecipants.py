import re
from typing import TYPE_CHECKING

from django.db import IntegrityError

from game_manager.exceptions import (
    PartecipantNotFoundError,
    SessionCompletedError,
    UsernameContainsIllegalCharactersError,
    UsernameLengthNotValidError,
    UsernameNotAvailableError,
)

if TYPE_CHECKING:
    from quizzes.models import Partecipant


USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9]{2,22}$")


def get_partecipant_by_token(token: str) -> "Partecipant":
    from quizzes.models import Partecipant

    try:
        return Partecipant.objects.prefetch_related("answers").get(token=token)
    except Partecipant.DoesNotExist:
        raise PartecipantNotFoundError()


def partecipant_with_name_exists(name: str, session_id: str) -> bool:
    from quizzes.models import Partecipant

    return Partecipant.objects.filter(name__iexact=name, session_id=session_id).exists()


def register_for_game(*, name: str, color: str, session_id: int) -> str:
    """
    Registers the username in the session_id game and returns the unique token
    associated to him.

    Raises UsernameNotAvailableError if the username is already used
    """
    from quizzes.models import Partecipant, QuizSession

    if not (2 <= len(name) <= 22):
        raise UsernameLengthNotValidError(
            "The username should be between 2 and 22 characters"
        )

    if not USERNAME_REGEX.match(name):
        raise UsernameContainsIllegalCharactersError(
            "The username contains illegal characters"
        )

    if partecipant_with_name_exists(name, session_id):
        raise UsernameNotAvailableError("This username is already used by someone else")

    session = QuizSession.objects.get(id=session_id)

    if session.is_finished:
        raise SessionCompletedError("The game ended!")

    partecipant = Partecipant.objects.create(
        name=name, color=color, session_id=session_id
    )
    return partecipant.token
