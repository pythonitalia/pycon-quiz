import asyncio
import dataclasses

from asgiref.sync import sync_to_async
from django_rq import job
from websockets.exceptions import ConnectionClosedOK

from api.game_manager.types import GameState
from game_manager.session import get_redis_channel_name_for_session_id, get_session
from pycon_quiz.redis import get_client


@job
def send_update(session=None, session_id=None):
    from quizzes.models import QuizSession

    if not session:
        session = QuizSession.objects.get(id=session_id)

    game_state = GameState.from_session(session)
    asyncio.run(update_game(session.id, game_state))


async def update_game(session_id: int, game_state: GameState):
    channel_name = get_redis_channel_name_for_session_id(session_id)
    client = await get_client()

    try:
        await client.publish_json(
            channel_name, dataclasses.asdict(game_state),
        )
    except ConnectionClosedOK:
        pass
    finally:
        client.close()


@sync_to_async
def get_game_state_from_session_id(id: int) -> "QuizSession":
    session = get_session(id)
    return GameState.from_session(session)
