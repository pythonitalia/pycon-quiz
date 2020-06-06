import asyncio
import typing

import strawberry

from api.game_manager.types import GameState
from django_hashids.hashids import decode_hashid
from game_manager.channels import (
    get_redis_channel_name_for_session_id,
    get_redis_channel_name_for_session_id_player_counts)
from game_manager.publisher import (get_game_state_from_session_id,
                                    send_players_count_update)
from game_manager.session import get_players_count
from pycon_quiz.redis import get_client


@strawberry.type
class GameManagerSubscription:
    @strawberry.subscription
    async def players_count(
        self, session_id: strawberry.ID
    ) -> typing.AsyncGenerator[int, None]:
        session_id = decode_hashid(session_id)

        players_count_channel = get_redis_channel_name_for_session_id_player_counts(
            session_id
        )

        client = await get_client()

        try:
            players = await get_players_count(client, session_id)
            yield players

            connection = await client.subscribe(players_count_channel)
            channel = connection[0]

            while await channel.wait_message():
                message = await channel.get_json()
                yield message["players_count"]
        finally:
            print("PLAYERS COUNT FINALLY")

            await client.unsubscribe(players_count_channel)
            client.close()

    @strawberry.subscription
    async def play_game(
        self, info, session_id: strawberry.ID
    ) -> typing.AsyncGenerator[GameState, None]:
        session_id = decode_hashid(session_id)

        # breakpoint()

        client = await get_client()

        main_game_channel_name = get_redis_channel_name_for_session_id(session_id)

        try:
            connection = await client.subscribe(main_game_channel_name)
            channel = connection[0]

            game_state = await get_game_state_from_session_id(session_id)
            yield game_state

            while await channel.wait_message():
                message = await channel.get_json()
                yield GameState.from_data(message)
        finally:
            print("PLAY GAME FINALLY")
            # breakpoint()
            await client.unsubscribe(main_game_channel_name)
            client.close()
