import dataclasses
import django.dispatch

from pycon_quiz.redis import get_client
from api.game_manager.types import GameState

from game_manager.session import get_redis_channel_name_for_session_id


async def update_game(session):
    client = await get_client()
    game_state = GameState.from_session(session)

    await client.publish_json(
        get_redis_channel_name_for_session_id(session.id),
        dataclasses.asdict(game_state),
    )

    client.close()
