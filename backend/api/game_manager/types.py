from typing import TYPE_CHECKING, Optional, List

import strawberry


if TYPE_CHECKING:
    from quizzes.models import QuizSession, Question as QuestionModel


@strawberry.type
class Answer:
    text: str

    @classmethod
    def from_data(cls, data):
        return cls(text=data["text"])


@strawberry.type
class Question:
    text: str
    answers: List[Answer]

    @classmethod
    def from_data(cls, data):
        if not data:
            return None

        return cls(
            **{
                **data,
                "answers": [Answer.from_data(answer) for answer in data["answers"]],
            }
        )


@strawberry.type
class GameState:
    status: str
    current_question: Optional[Question]

    @classmethod
    def from_data(cls, data):
        return cls(
            **{**data, "current_question": Question.from_data(data["current_question"])}
        )

    @classmethod
    def from_session(cls, session: "QuizSession"):
        return cls.from_data(_map_session_to_data_dict(session))


def _map_session_to_data_dict(session: "QuizSession"):
    return {
        "status": session.status,
        "current_question": {
            "text": session.current_question.text,
            "answers": [
                {"text": answer.text}
                for answer in session.current_question.answers.all()
            ],
        }
        if session.current_question
        else None,
    }
