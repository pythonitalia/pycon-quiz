from typing import Union
import strawberry

from game_manager.session import get_session, answer_question


@strawberry.type
class Error:
    message: str


@strawberry.type
class OperationResult:
    ok: bool


@strawberry.type
class QuizzesMutation:
    @strawberry.mutation
    def answer_question(
        self,
        info,
        session_id: strawberry.ID,
        question_id: strawberry.ID,
        answer_id: strawberry.ID,
    ) -> Union[Error, OperationResult]:
        from users.models import User
        from quizzes.models import QuizSession

        session: QuizSession = get_session(session_id)
        # todo implement authentication
        user = User.objects.get(username="admin")

        try:
            answer_question(
                session=session,
                question_id=int(question_id),
                answer_id=int(answer_id),
                user=user,
            )
        except ValueError as exc:
            return Error(message=str(exc))

        return OperationResult(ok=True)
