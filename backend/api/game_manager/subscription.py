import typing
import strawberry

from game_manager.session import get_redis_channel_name_for_session_id
from api.game_manager.types import GameState

from pycon_quiz.redis import get_client


@strawberry.type
class GameManagerSubscription:
    @strawberry.subscription
    async def play_game(
        self, info, session_id: int
    ) -> typing.AsyncGenerator[GameState, None]:
        client = await get_client()
        connection = await client.subscribe(
            get_redis_channel_name_for_session_id(session_id)
        )
        channel = connection[0]

        try:
            while await channel.wait_message():
                message = await channel.get_json()
                yield GameState.from_data(message)
        finally:
            client.close()
