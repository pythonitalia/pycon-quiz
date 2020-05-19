import pytest
from pytest import raises

from game_manager.exceptions import (
    SessionCompletedError,
    UsernameAlreadyUsedError,
    UsernameContainsIllegalCharactersError,
    UsernameLengthNotValidError,
)
from game_manager.partecipants import register_for_game

pytestmark = pytest.mark.django_db


def test_cannot_register_for_game_with_username_too_short(live_quiz_session):
    with raises(
        UsernameLengthNotValidError,
        match="The username should be between 2 and 22 characters",
    ):
        register_for_game(name="a", color="#000000", session_id=live_quiz_session.id)


def test_cannot_register_for_game_with_username_too_long(live_quiz_session):
    with raises(
        UsernameLengthNotValidError,
        match="The username should be between 2 and 22 characters",
    ):
        register_for_game(
            name="afsdfsdfsdfsdfsdfsdfsdfdsfdsfsdfsdfsdfds",
            color="#000000",
            session_id=live_quiz_session.id,
        )


@pytest.mark.parametrize(
    "username",
    ["dds@fsdf$ fsdfsd", "dds@fsdf$fsdfsd", "dds fsdf", " aa", "bb  ", "AaA $"],
)
def test_cannot_register_for_game_with_username_containg_illegal_characters(
    live_quiz_session, username
):
    with raises(
        UsernameContainsIllegalCharactersError,
        match="The username contains illegal characters",
    ):
        register_for_game(
            name=username, color="#000000", session_id=live_quiz_session.id,
        )


def test_cannot_register_for_completed_game(complete_quiz_session):
    with raises(
        SessionCompletedError, match="The game ended!",
    ):
        register_for_game(
            name="nina", color="#000000", session_id=complete_quiz_session.id,
        )


def test_cannot_register_with_already_used_username(
    live_quiz_session, partecipant_factory
):
    partecipant_factory(session=live_quiz_session, name="nina")

    with raises(
        UsernameAlreadyUsedError, match="This username is already used by someone else",
    ):
        register_for_game(
            name="nina", color="#000000", session_id=live_quiz_session.id,
        )


def test_register_for_game(live_quiz_session):
    token = register_for_game(
        name="nina", color="#000000", session_id=live_quiz_session.id,
    )

    assert live_quiz_session.partecipants.count() == 1
    partecipant = live_quiz_session.partecipants.filter(token=token).first()

    assert partecipant.name == "nina"
    assert partecipant.color == "#000000"
