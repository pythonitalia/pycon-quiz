from typing import TYPE_CHECKING, Optional, List

import strawberry


if TYPE_CHECKING:
    from quizzes.models import QuizSession, Question as QuestionModel


@strawberry.type
class Answer:
    text: str

    @classmethod
    def create_answers_from_question(cls, question: "QuestionModel") -> List["Answer"]:
        return [cls(text=answer.text) for answer in question.answers.all()]


@strawberry.type
class Question:
    text: str
    answers: List[Answer]

    @classmethod
    def from_question(cls, question: Optional["QuestionModel"]):
        if not question:
            return None

        return cls(
            text=question.text, answers=Answer.create_answers_from_question(question)
        )


@strawberry.type
class GameState:
    status: str
    current_question: Optional[Question]

    @classmethod
    def from_session(cls, session: "QuizSession"):
        return cls(
            status=session.status,
            current_question=Question.from_question(session.current_question),
        )
