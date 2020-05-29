from typing import TYPE_CHECKING

from django.db.models import Count, Q, Sum
from django.db.models.functions import Coalesce

from game_manager.channels import get_redis_channel_name_for_session_id
from game_manager.exceptions import (AnswerNotFoundError, AnswerOutOfTimeError,
                                     PartecipantNotFoundError,
                                     SessionNotLiveError,
                                     UnableToAnswerQuestionError)

if TYPE_CHECKING:
    from users.models import User
    from quizzes.models import QuizSession, Question


def get_session(id: int) -> "QuizSession":
    from quizzes.models import QuizSession

    return QuizSession.objects.get(id=id)


async def get_players_count(client, session_id: int):
    game_main_channel = get_redis_channel_name_for_session_id(session_id)
    players = await client.pubsub_numsub(game_main_channel)
    print("get_players_count CALLED", players)
    return players[game_main_channel.encode()]


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

    if not session.can_answer_question:
        raise AnswerOutOfTimeError(
            f"Cannot change answers after {session.seconds_to_answer_question} seconds"
        )

    obj, created = UserAnswer.objects.update_or_create(
        partecipant=partecipant,
        question_id=question_id,
        session=session,
        defaults={"answer_id": answer_id},
    )
    return obj


def generate_leaderboard(quiz_session: "QuizSession"):
    return quiz_session.partecipants.annotate(
        tot_answers=Count("answers"),
        score=Coalesce(
            Sum(
                "answers__answer__question__points_to_give",
                filter=Q(answers__answer__is_correct=True),
            ),
            0,
        ),
    ).order_by("-score", "-tot_answers")
