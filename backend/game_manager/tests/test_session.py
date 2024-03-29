import pytest
from django.utils import timezone
from freezegun import freeze_time
from pytest import raises

from game_manager.exceptions import (
    AnswerNotFoundError,
    AnswerOutOfTimeError,
    ParticipantNotFoundError,
    SessionNotLiveError,
    UnableToAnswerQuestionError,
)
from game_manager.session import (
    answer_question,
    generate_leaderboard,
    get_redis_channel_name_for_session_id,
    get_session,
)

pytestmark = pytest.mark.django_db


@freeze_time("2020-05-05 10:10:00")
def test_answer_question(
    live_session_with_questions, live_session_with_questions_participant
):
    question = live_session_with_questions.quiz.questions.first()
    answer = question.answers.first()

    participant_answer = answer_question(
        session_id=live_session_with_questions.id,
        question_id=question.id,
        answer_id=answer.id,
        participant_token=live_session_with_questions_participant.token,
    )

    assert participant_answer.answer.question == question
    assert participant_answer.participant == live_session_with_questions_participant


@freeze_time("2020-05-05 10:10:00")
def test_cannot_answer_with_invalid_participant_token(
    live_session_with_questions, live_session_with_questions_participant
):
    question = live_session_with_questions.quiz.questions.first()
    answer = question.answers.first()

    with raises(ParticipantNotFoundError, match="Token not valid"):
        answer_question(
            session_id=live_session_with_questions.id,
            question_id=question.id,
            answer_id=answer.id,
            participant_token="aaaaaaaaaaaaa",
        )


@freeze_time("2020-05-05 10:10:00")
def test_cannot_answer_with_participant_token_of_another_session(
    live_session_with_questions,
    live_session_with_questions_participant,
    draft_quiz_session_participant,
):
    question = live_session_with_questions.quiz.questions.first()
    answer = question.answers.first()

    with raises(ParticipantNotFoundError, match="Token not valid"):
        answer_question(
            session_id=live_session_with_questions.id,
            question_id=question.id,
            answer_id=answer.id,
            participant_token=draft_quiz_session_participant.token,
        )


@freeze_time("2020-05-05 10:10:00")
def test_cannot_answer_question_with_invalid_answer_id(
    live_session_with_questions, live_session_with_questions_participant
):
    question = live_session_with_questions.quiz.questions.first()
    answer = question.answers.first()

    with raises(AnswerNotFoundError, match="Invalid Answer ID"):
        answer_question(
            session_id=live_session_with_questions.id,
            question_id=question.id,
            answer_id=300,
            participant_token=live_session_with_questions_participant.token,
        )


@freeze_time("2020-05-05 10:10:00")
def test_cannot_answer_not_current_question_of_the_session(
    live_session_with_questions, live_session_with_questions_participant
):
    question = live_session_with_questions.quiz.questions.all()[1]
    answer = question.answers.first()

    with raises(UnableToAnswerQuestionError, match="Unable to answer this question"):
        answer_question(
            session_id=live_session_with_questions.id,
            question_id=question.id,
            answer_id=answer.id,
            participant_token=live_session_with_questions_participant.token,
        )


def test_cannot_answer_session_not_live(
    draft_quiz_session, draft_quiz_session_participant
):
    question = draft_quiz_session.quiz.questions.first()
    answer = question.answers.first()

    with raises(SessionNotLiveError, match="Session is not live"):
        answer_question(
            session_id=draft_quiz_session.id,
            question_id=question.id,
            answer_id=answer.id,
            participant_token=draft_quiz_session_participant.token,
        )


def test_cannot_answer_question_after_timeout(
    live_session_with_questions, live_session_with_questions_participant
):
    with freeze_time("2020-05-05 10:10:00"):
        live_session_with_questions.current_question_changed = timezone.now()

    live_session_with_questions.seconds_to_answer_question = 10
    live_session_with_questions.save()

    question = live_session_with_questions.quiz.questions.first()
    answer = question.answers.first()

    with freeze_time("2020-05-05 10:30:00"), raises(
        AnswerOutOfTimeError, match="Cannot change answers after 10 seconds"
    ):
        answer_question(
            session_id=live_session_with_questions.id,
            question_id=question.id,
            answer_id=answer.id,
            participant_token=live_session_with_questions_participant.token,
        )


def test_get_redis_channel_name_for_session(live_quiz_session):
    assert (
        f"gamesession:{live_quiz_session.id}"
        == get_redis_channel_name_for_session_id(live_quiz_session.id)
    )


def test_get_session(live_quiz_session):
    assert get_session(live_quiz_session.id) == live_quiz_session


def test_generate_leaderboard(
    live_session_with_questions,
    live_session_with_questions_participant,
    participant_factory,
    user_answer_factory,
):
    question_1 = live_session_with_questions.quiz.questions.all()[0]
    correct_answer_1 = question_1.answers.filter(is_correct=True).first()
    incorrect_answer_1 = question_1.answers.filter(is_correct=False).first()

    question_2 = live_session_with_questions.quiz.questions.all()[1]
    correct_answer_2 = question_2.answers.filter(is_correct=True).first()
    incorrect_answer_2 = question_2.answers.filter(is_correct=False).first()

    user_answer_factory(
        participant=live_session_with_questions_participant,
        session=live_session_with_questions,
        question=question_1,
        answer=correct_answer_1,
    )

    user_answer_factory(
        participant=live_session_with_questions_participant,
        session=live_session_with_questions,
        question=question_2,
        answer=correct_answer_2,
    )

    participant_2 = participant_factory(session=live_session_with_questions)

    user_answer_factory(
        participant=participant_2,
        session=live_session_with_questions,
        question=question_2,
        answer=incorrect_answer_2,
    )

    user_answer_factory(
        participant=participant_2,
        session=live_session_with_questions,
        question=question_1,
        answer=correct_answer_1,
    )

    participant_3 = participant_factory(session=live_session_with_questions)

    participant_4 = participant_factory(session=live_session_with_questions)

    user_answer_factory(
        participant=participant_4,
        session=live_session_with_questions,
        question=question_1,
        answer=incorrect_answer_1,
    )

    leaderboard = generate_leaderboard(live_session_with_questions)

    assert list(leaderboard.values("name", "tot_answers", "score")) == [
        {
            "name": live_session_with_questions_participant.name,
            "tot_answers": 2,
            "score": 2,
        },
        {"name": participant_2.name, "tot_answers": 2, "score": 1,},
        {"name": participant_4.name, "tot_answers": 1, "score": 0,},
        {"name": participant_3.name, "tot_answers": 0, "score": 0,},
    ]


def test_leaderboard_with_questions_worth_more_than_1_point(
    live_session_with_questions,
    live_session_with_questions_participant,
    participant_factory,
    user_answer_factory,
):
    question_1 = live_session_with_questions.quiz.questions.all()[0]
    correct_answer_1 = question_1.answers.filter(is_correct=True).first()
    incorrect_answer_1 = question_1.answers.filter(is_correct=False).first()

    question_2 = live_session_with_questions.quiz.questions.all()[1]
    question_2.points_to_give = 3
    question_2.save()
    correct_answer_2 = question_2.answers.filter(is_correct=True).first()
    incorrect_answer_2 = question_2.answers.filter(is_correct=False).first()

    user_answer_factory(
        participant=live_session_with_questions_participant,
        session=live_session_with_questions,
        question=question_2,
        answer=correct_answer_2,
    )

    participant_2 = participant_factory(session=live_session_with_questions)

    user_answer_factory(
        participant=participant_2,
        session=live_session_with_questions,
        question=question_1,
        answer=correct_answer_1,
    )

    user_answer_factory(
        participant=participant_2,
        session=live_session_with_questions,
        question=question_2,
        answer=incorrect_answer_2,
    )

    leaderboard = generate_leaderboard(live_session_with_questions)

    assert list(leaderboard.values("name", "tot_answers", "score")) == [
        {
            "name": live_session_with_questions_participant.name,
            "tot_answers": 1,
            "score": 3,
        },
        {"name": participant_2.name, "tot_answers": 2, "score": 1,},
    ]
