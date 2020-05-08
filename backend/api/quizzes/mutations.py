from typing import Union
import strawberry
from django.utils.translation import ugettext_lazy as _

from game_manager.session import get_session, answer_question, register_for_game
from game_manager.exceptions import UsernameAlreadyUsedError

from api.quizzes.types import Error, OperationResult, Token, Partecipant


@strawberry.type
class QuizzesMutation:
    @strawberry.mutation
    def register_for_game(
        self, info, session_id: strawberry.ID, name: str
    ) -> Union[Error, Token]:
        try:
            token = register_for_game(name=name, session_id=int(session_id))
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
