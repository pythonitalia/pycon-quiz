class GameError(Exception):
    pass


class UsernameNotAvailableError(GameError):
    """Raised when the user tries to join a game with an already used username"""


class SessionNotLiveError(GameError):
    pass


class UnableToAnswerQuestionError(GameError):
    pass


class AnswerNotFoundError(GameError):
    pass


class ParticipantNotFoundError(GameError):
    pass


class SessionNotFoundError(GameError):
    pass


class AnswerOutOfTimeError(GameError):
    pass


class SessionCompletedError(GameError):
    pass


class UsernameContainsIllegalCharactersError(GameError):
    pass


class UsernameLengthNotValidError(GameError):
    pass
