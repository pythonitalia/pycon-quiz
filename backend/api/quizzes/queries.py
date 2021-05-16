from typing import Optional

import strawberry

from api.quizzes.types import Participant, QuizSession
from game_manager.exceptions import ParticipantNotFoundError, SessionNotFoundError
from game_manager.participants import get_participant_by_token
from game_manager.session import get_session
from django_hashids.hashids import decode_hashid


@strawberry.type
class QuizzesQuery:
    @strawberry.field
    def session(self, id: strawberry.ID) -> Optional[QuizSession]:
        try:
            session = get_session(decode_hashid(id))
            return QuizSession.from_model(session)
        except SessionNotFoundError:
            return None

    @strawberry.field
    def me(self, info, token: str) -> Optional[Participant]:
        try:
            participant = get_participant_by_token(token)
            return Participant.from_model(participant)
        except ParticipantNotFoundError:
            return None
