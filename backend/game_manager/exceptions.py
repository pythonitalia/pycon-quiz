class UsernameAlreadyUsedError(Exception):
    """Raised when the user tries to join a game with an already used username"""


class PartecipantNotFoundError(Exception):
    pass


class SessionNotLiveError(Exception):
    pass


class UnableToAnswerQuestionError(Exception):
    pass


class AnswerNotFoundError(Exception):
    pass


class PartecipantNotFoundError(Exception):
    pass


class SessionNotFoundError(Exception):
    pass


class AnswerOutOfTimeError(Exception):
    pass
