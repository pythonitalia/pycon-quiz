from game_manager.publisher import send_update
from quizzes.models import QuizSession


def go_live(session: QuizSession):
    session.go_live()
    session.save()
    send_update(session)


def go_to_next_question(session: QuizSession):
    session.current_question = session.next_question
    session.save()
    send_update(session)


def end(session: QuizSession):
    session.end()
    session.save()
    send_update(session)


def send_generic_update(session: QuizSession):
    send_update(session)
