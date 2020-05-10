import asyncio
import dataclasses

from api.game_manager.types import GameState
from game_manager.session import get_redis_channel_name_for_session_id
from pycon_quiz.redis import get_client


def send_update(session: QuizSession):
    game_state = GameState.from_session(session)
    asyncio.run(update_game(session.id, game_state))


async def update_game(session_id: int, game_state: GameState):
    client = await get_client()

    await client.publish_json(
        get_redis_channel_name_for_session_id(session_id),
        dataclasses.asdict(game_state),
    )

    client.close()
