import re
from typing import TYPE_CHECKING

from game_manager.exceptions import (
    ParticipantNotFoundError,
    SessionCompletedError,
    UsernameContainsIllegalCharactersError,
    UsernameLengthNotValidError,
    UsernameNotAvailableError,
)

if TYPE_CHECKING:
    from quizzes.models import Participant


USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9]{2,22}$")


def get_participant_by_token(token: str) -> "Participant":
    from quizzes.models import Participant

    try:
        return Participant.objects.prefetch_related("answers").get(token=token)
    except Participant.DoesNotExist:
        raise ParticipantNotFoundError()


def participant_with_name_exists(name: str, session_id: str) -> bool:
    from quizzes.models import Participant

    return Participant.objects.filter(name__iexact=name, session_id=session_id).exists()


def register_for_game(*, name: str, color: str, session_id: int) -> str:
    """
    Registers the username in the session_id game and returns the unique token
    associated to him.

    Raises UsernameNotAvailableError if the username is already used
    """
    from quizzes.models import Participant, QuizSession

    if not (2 <= len(name) <= 22):
        raise UsernameLengthNotValidError(
            "The username should be between 2 and 22 characters"
        )

    if not USERNAME_REGEX.match(name):
        raise UsernameContainsIllegalCharactersError(
            "The username contains illegal characters"
        )

    if participant_with_name_exists(name, session_id):
        raise UsernameNotAvailableError("This username is already used by someone else")

    session = QuizSession.objects.get(id=session_id)

    if session.is_finished:
        raise SessionCompletedError("The game ended!")

    participant = Participant.objects.create(
        name=name, color=color, session_id=session_id
    )
    return participant.token
