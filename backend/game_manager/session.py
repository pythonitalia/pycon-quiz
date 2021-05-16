from typing import TYPE_CHECKING

from django.db.models import Count, Q, Sum
from django.db.models.functions import Coalesce

from game_manager.exceptions import (
    AnswerNotFoundError,
    AnswerOutOfTimeError,
    ParticipantNotFoundError,
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
    *, session_id: int, question_id: int, answer_id: int, participant_token: str
):
    """
    Records the participant answer in the session
    """
    from quizzes.models import UserAnswer, QuizSession, Participant

    session = QuizSession.objects.get(id=session_id)

    try:
        participant = Participant.objects.get(
            token=participant_token, session_id=session_id
        )
    except Participant.DoesNotExist:
        raise ParticipantNotFoundError("Token not valid")

    if not session.is_live:
        raise SessionNotLiveError("Session is not live")

    if session.current_question_id != question_id:
        raise UnableToAnswerQuestionError("Unable to answer this question")

    if not session.current_question.answers.filter(id=answer_id).exists():
        raise AnswerNotFoundError("Invalid Answer ID")

    if not session.can_answer_question:
        raise AnswerOutOfTimeError(
            f"Cannot change answers after {session.seconds_to_answer_question} seconds"
        )

    obj, _ = UserAnswer.objects.update_or_create(
        participant=participant,
        question_id=question_id,
        session=session,
        defaults={"answer_id": answer_id},
    )
    return obj


def generate_leaderboard(quiz_session: "QuizSession"):
    return quiz_session.participants.annotate(
        tot_answers=Count("answers"),
        score=Coalesce(
            Sum(
                "answers__answer__question__points_to_give",
                filter=Q(answers__answer__is_correct=True),
            ),
            0,
        ),
    ).order_by("-score", "-tot_answers")
