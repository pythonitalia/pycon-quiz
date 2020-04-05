from quizzes.models import QuizSession

from game_manager.signals import update_game


def go_live(session: QuizSession):
    session.go_live()
    session.save()
    update_game(session)


def go_to_next_question(session: QuizSession):
    session.current_question = session.next_question
    session.save()
    update_game(session)


def end(session: QuizSession):
    session.end()
    session.save()
    update_game(session)
