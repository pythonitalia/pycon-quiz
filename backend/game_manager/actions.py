from datetime import timedelta

import django_rq

from game_manager.publisher import send_update
from quizzes.models import QuizSession


def go_to_next_question(session: QuizSession):
    session.show_next_question()
    session.save()
    send_update(session)

    scheduler = django_rq.get_scheduler("default")
    scheduler.enqueue_in(
        timedelta(seconds=session.seconds_to_answer_question + 1),
        send_update,
        session_id=session,
    )


def end(session: QuizSession):
    session.end()
    session.save()
    send_update(session)


def send_generic_update(session: QuizSession):
    send_update(session)
