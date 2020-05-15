from datetime import timedelta
from typing import TYPE_CHECKING

from django.utils import timezone

from game_manager.constants import GRACE_PERIOD_FOR_ANSWER_CHANGE_IN_SECONDS
from game_manager.exceptions import (
    AnswerNotFoundError,
    AnswerOutOfTimeError,
    PartecipantNotFoundError,
    SessionNotLiveError,
    UnableToAnswerQuestionError,
)

if TYPE_CHECKING:
    from users.models import User
    from quizzes.models import QuizSession, Question


def get_session(id: int) -> "QuizSession":
    from quizzes.models import QuizSession

    return QuizSession.objects.get(id=id)


def get_redis_channel_name_for_session_id(id: int):
    return f"gamesession:{id}"


def answer_question(
    *, session_id: int, question_id: int, answer_id: int, partecipant_token: str
):
    """
    Records the partecipant answer in the session
    """
    from quizzes.models import UserAnswer, QuizSession, Partecipant

    session = QuizSession.objects.get(id=session_id)

    try:
        partecipant = Partecipant.objects.get(
            token=partecipant_token, session_id=session_id
        )
    except Partecipant.DoesNotExist:
        raise PartecipantNotFoundError("Token not valid")

    if not session.is_live:
        raise SessionNotLiveError("Session is not live")

    if session.current_question_id != question_id:
        raise UnableToAnswerQuestionError("Unable to answer this question")

    if not session.current_question.answers.filter(id=answer_id).exists():
        raise AnswerNotFoundError("Invalid Answer ID")

    current_time = timezone.now()
    already_existing_answer = (
        UserAnswer.objects.filter(
            partecipant=partecipant, question_id=question_id, session=session
        )
        .values("created")
        .first()
    )

    if already_existing_answer:
        created_at = already_existing_answer["created"]

        if current_time - created_at > timedelta(
            seconds=GRACE_PERIOD_FOR_ANSWER_CHANGE_IN_SECONDS
        ):
            raise AnswerOutOfTimeError(
                f"Cannot change answers after {GRACE_PERIOD_FOR_ANSWER_CHANGE_IN_SECONDS} seconds"
            )

    obj, created = UserAnswer.objects.update_or_create(
        partecipant=partecipant,
        question_id=question_id,
        session=session,
        defaults={"answer_id": answer_id},
    )
    return obj
