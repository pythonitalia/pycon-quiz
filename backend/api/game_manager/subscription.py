import asyncio
import typing

import strawberry

from api.game_manager.types import GameState
from django_hashids.hashids import decode_hashid
from game_manager.channels import (
    get_redis_channel_name_for_session_id,
    get_redis_channel_name_for_session_id_player_counts,
)
from game_manager.publisher import (
    get_game_state_from_session_id,
    send_players_count_update,
)
from game_manager.session import get_players_count
from pycon_quiz.redis import get_client


@strawberry.type
class GameManagerSubscription:
    @strawberry.subscription
    async def players_count(
        self, session_id: strawberry.ID
    ) -> typing.AsyncGenerator[int, None]:
        print("PLAYERS COUNT SUBSCRIPTION")
        client = await get_client()
        session_id = decode_hashid(session_id)

        players_count_channel = get_redis_channel_name_for_session_id_player_counts(
            session_id
        )

        players = await get_players_count(client, session_id)
        print("players::", players)
        yield players

        try:
            connection = await client.subscribe(players_count_channel)
            channel = connection[0]

            while await channel.wait_message():
                message = await channel.get_json()
                yield message["players_count"]
        finally:
            await client.unsubscribe(players_count_channel)
            client.close()

    @strawberry.subscription
    async def play_game(
        self, info, session_id: strawberry.ID
    ) -> typing.AsyncGenerator[GameState, None]:
        client = await get_client()
        session_id = decode_hashid(session_id)

        send_players_count_update.delay(session_id=session_id)
        game_main_channel = get_redis_channel_name_for_session_id(session_id)

        try:
            connection = await client.subscribe(game_main_channel)
            channel = connection[0]

            game_state = await get_game_state_from_session_id(session_id)
            yield game_state

            while await channel.wait_message():
                message = await channel.get_json()
                yield GameState.from_data(message)
        finally:
            await client.unsubscribe(game_main_channel)

            send_players_count_update.delay(session_id=session_id)
            client.close()
