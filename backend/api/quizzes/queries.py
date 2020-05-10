from typing import Optional

import strawberry

from api.quizzes.types import Partecipant
from game_manager.exceptions import PartecipantNotFoundError
from game_manager.partecipants import get_partecipant_by_token


@strawberry.type
class QuizzesQuery:
    @strawberry.field
    def me(self, info, token: str) -> Optional[Partecipant]:
        try:
            partecipant = get_partecipant_by_token(token)
            return Partecipant.from_model(partecipant)
        except PartecipantNotFoundError:
            return None
