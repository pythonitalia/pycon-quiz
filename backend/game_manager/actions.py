import asyncio

from game_manager.publisher import update_game
from game_manager.session import get_session_async
from quizzes.models import QuizSession


def go_live(session: QuizSession):
    session.go_live()
    session.save()
    asyncio.run(_send_update(session.id))


def go_to_next_question(session: QuizSession):
    session.current_question = session.next_question
    session.save()
    asyncio.run(_send_update(session.id))


def end(session: QuizSession):
    session.end()
    session.save()
    asyncio.run(_send_update(session.id))


def send_generic_update(session: QuizSession):
    asyncio.run(_send_update(session.id))


async def _send_update(session_id: int):
    session = await get_session_async(session_id)
    await update_game(session)
