import typing

import strawberry

from api.game_manager.types import GameState
from game_manager.publisher import get_game_state_from_session_id
from game_manager.session import get_redis_channel_name_for_session_id
from pycon_quiz.redis import get_client


@strawberry.type
class GameManagerSubscription:
    @strawberry.subscription
    async def play_game(
        self, info, session_id: strawberry.ID
    ) -> typing.AsyncGenerator[GameState, None]:
        client = await get_client()

        try:
            connection = await client.subscribe(
                get_redis_channel_name_for_session_id(session_id)
            )
            channel = connection[0]

            # get the state from the DB the first time
            # TODO: Update to store in redis the last published session?
            # possible race condition?
            yield get_game_state_from_session_id(session_id)

            while await channel.wait_message():
                message = await channel.get_json()
                yield GameState.from_data(message)
        finally:
            client.close()
