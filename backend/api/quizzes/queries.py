from typing import Optional

import strawberry

from api.quizzes.types import Partecipant, QuizSession
from game_manager.exceptions import PartecipantNotFoundError, SessionNotFoundError
from game_manager.partecipants import get_partecipant_by_token
from game_manager.session import get_session


@strawberry.type
class QuizzesQuery:
    @strawberry.field
    def session(self, id: strawberry.ID) -> Optional[QuizSession]:
        try:
            session = get_session(int(id))
            return QuizSession.from_model(session)
        except SessionNotFoundError:
            return None

    @strawberry.field
    def me(self, info, token: str) -> Optional[Partecipant]:
        try:
            partecipant = get_partecipant_by_token(token)
            return Partecipant.from_model(partecipant)
        except PartecipantNotFoundError:
            return None
