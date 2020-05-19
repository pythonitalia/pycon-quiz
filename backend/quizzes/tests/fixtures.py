import pytest
from pytest import fixture

from quizzes.models import QuizSession


@fixture
def live_quiz_session(quiz_session_factory):
    session = quiz_session_factory(status=QuizSession.Status.live)
    return session


@fixture
def complete_quiz_session(quiz_session_factory):
    session = quiz_session_factory(status=QuizSession.Status.complete)
    return session
