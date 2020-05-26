import pytest
from django.utils import timezone
from pytest import fixture

from quizzes.models import QuizSession


@fixture
def question_with_answers(question_factory, answer_factory):
    def _inner(session):
        question = question_factory(quiz=session.quiz)
        answer_factory(question=question)
        answer_factory(question=question)
        return question

    return _inner


@fixture
def draft_quiz_session(quiz_session_factory, question_with_answers):
    session = quiz_session_factory(status=QuizSession.Status.draft)
    question = question_with_answers(session)

    session.current_question = question
    session.current_question_changed = timezone.now()
    session.save()
    return session


@fixture
def draft_quiz_session_partecipant(draft_quiz_session, partecipant_factory):
    partecipant = partecipant_factory()
    draft_quiz_session.partecipants.add(partecipant)
    return partecipant


@fixture
def live_quiz_session(quiz_session_factory):
    session = quiz_session_factory(status=QuizSession.Status.live)
    return session


@fixture
def complete_quiz_session(quiz_session_factory):
    session = quiz_session_factory(status=QuizSession.Status.complete)
    return session


@fixture
def live_session_with_questions(live_quiz_session, question_with_answers):
    question_1 = question_with_answers(live_quiz_session)
    question_2 = question_with_answers(live_quiz_session)

    live_quiz_session.current_question = question_1
    live_quiz_session.current_question_changed = timezone.now()
    live_quiz_session.save()
    return live_quiz_session


@fixture
def live_session_with_questions_partecipant(
    live_session_with_questions, partecipant_factory
):
    partecipant = partecipant_factory()
    live_session_with_questions.partecipants.add(partecipant)
    return partecipant
