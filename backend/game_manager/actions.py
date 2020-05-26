from datetime import datetime, timedelta

import django_rq

from game_manager.publisher import send_update
from quizzes.models import QuizSession


def go_to_next_question(session: QuizSession):
    session.show_next_question()
    session.save()
    send_update(session.id)
    _schedule_delayed_update(session)


def end(session: QuizSession):
    session.end()
    session.save()
    send_update(session.id)


def send_generic_update(session: QuizSession):
    send_update(session.id)


def show_leaderboard(session: QuizSession):
    session.show_leaderboard()
    session.save()
    send_update(session.id)


def set_question_changed_time_to(session: QuizSession, time: datetime):
    session.current_question_changed = time
    session.save()
    send_update(session.id)
    _schedule_delayed_update(session)


def _schedule_delayed_update(session: QuizSession):
    scheduler = django_rq.get_scheduler("default")
    scheduler.enqueue_in(
        timedelta(seconds=session.seconds_to_answer_question + 1),
        send_update,
        session_id=session.id,
    )
