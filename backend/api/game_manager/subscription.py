import asyncio
import typing
import strawberry

from game_manager.session import get_session
from game_manager.signals import register_on_update

from api.game_manager.types import GameState


@strawberry.type
class GameManagerSubscription:
    @strawberry.subscription
    async def play_game(
        self, info, session_id: int
    ) -> typing.AsyncGenerator[GameState, None]:
        while True:
            session = await get_session(session_id)
            yield GameState.from_session(session)
            await asyncio.sleep(3)
