import asyncio
import dataclasses

from asgiref.sync import sync_to_async
from django_rq import job
from websockets.exceptions import ConnectionClosedOK

from api.game_manager.types import GameState
from game_manager.channels import (
    get_redis_channel_name_for_session_id,
    get_redis_channel_name_for_session_id_player_counts,
)
from game_manager.session import get_players_count, get_session
from pycon_quiz.redis import get_client


@job
def send_players_count_update(session_id: int):
    asyncio.run(async_send_players_count_update(session_id))


async def async_send_players_count_update(session_id: int):
    client = await get_client()
    channel_name = get_redis_channel_name_for_session_id_player_counts(session_id)

    players_count = await get_players_count(client, session_id)

    try:
        payload = {"players_count": players_count}
        await client.publish_json(channel_name, payload)
    except ConnectionClosedOK:
        pass
    finally:
        client.close()


@job
def send_update(session_id):
    from quizzes.models import QuizSession

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
