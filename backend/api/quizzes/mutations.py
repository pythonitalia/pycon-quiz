from typing import Union

import strawberry
from django.utils.translation import ugettext_lazy as _

from api.quizzes.types import Error, OperationResult, Partecipant, Token
from game_manager.exceptions import UsernameAlreadyUsedError
from game_manager.partecipants import register_for_game
from game_manager.session import answer_question, get_session


@strawberry.type
class QuizzesMutation:
    @strawberry.mutation
    def register_for_game(
        self, info, session_id: strawberry.ID, name: str, color: str
    ) -> Union[Error, Token]:
        try:
            token = register_for_game(
                name=name, color=color, session_id=int(session_id)
            )
            return Token(token=token)
        except UsernameAlreadyUsedError as exc:
            return Error(message=str(exc))

    @strawberry.mutation
    def answer_question(
        self,
        info,
        session_id: strawberry.ID,
        question_id: strawberry.ID,
        answer_id: strawberry.ID,
        token: str,
    ) -> Union[Error, Partecipant]:
        try:
            answer = answer_question(
                session_id=int(session_id),
                question_id=int(question_id),
                answer_id=int(answer_id),
                partecipant_token=token,
            )
        except ValueError as exc:
            return Error(message=str(exc))

        return Partecipant.from_model(answer.partecipant)
