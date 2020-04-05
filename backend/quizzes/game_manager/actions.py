from quizzes.models import QuizSession


def go_live(session: QuizSession):
    session.go_live()
    session.save()


def go_to_next_question(session: QuizSession):
    session.current_question = session.next_question
    session.save()


def end(session: QuizSession):
    session.end()
    session.save()
