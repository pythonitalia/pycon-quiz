from typing import TYPE_CHECKING
from asgiref.sync import sync_to_async

if TYPE_CHECKING:
    from users.models import User
    from quizzes.models import QuizSession, Question

from game_manager.exceptions import (
    PartecipantNotFoundError,
    SessionNotLiveError,
    UnableToAnswerQuestionError,
    AnswerNotFoundError,
)


def get_session(id: int) -> "QuizSession":
    from quizzes.models import QuizSession

    return (
        QuizSession.objects.prefetch_related("current_question__answers")
        .select_related("quiz", "current_question")
        .get(id=id)
    )


@sync_to_async
def get_session_async(id: int) -> "QuizSession":
    return get_session(id)


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

    obj, created = UserAnswer.objects.update_or_create(
        partecipant=partecipant,
        question_id=question_id,
        session=session,
        defaults={"answer_id": answer_id},
    )
    return obj
