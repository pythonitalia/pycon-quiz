from typing import TYPE_CHECKING, List, Optional

import strawberry
from strawberry.types import DateTime

if TYPE_CHECKING:
    from quizzes.models import QuizSession, Question as QuestionModel


@strawberry.type
class Answer:
    id: strawberry.ID
    text: str

    @classmethod
    def from_data(cls, data):
        return cls(id=data["id"], text=data["text"])


@strawberry.type
class Question:
    id: strawberry.ID
    text: str
    answers: List[Answer]
    ui: str

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
class LeaderboardPartecipant:
    name: str
    score: int
    color: str

    @classmethod
    def from_data(cls, data):
        return cls(name=data["name"], score=data["score"], color=data["color"])


@strawberry.type
class GameState:
    status: str
    current_question: Optional[Question]
    leaderboard: Optional[List[LeaderboardPartecipant]]
    current_question_changed: Optional[str]
    seconds_to_answer_question: int

    @classmethod
    def from_data(cls, data):
        return cls(
            **{
                **data,
                "current_question": Question.from_data(data["current_question"]),
                "leaderboard": [
                    LeaderboardPartecipant.from_data(partecipant)
                    for partecipant in data["leaderboard"]
                ]
                if data["leaderboard"]
                else None,
                "current_question_changed": data["current_question_changed"],
                "seconds_to_answer_question": data["seconds_to_answer_question"],
            }
        )

    @classmethod
    def from_session(cls, session: "QuizSession"):
        return cls.from_data(_map_session_to_data_dict(session))


def _map_session_to_data_dict(session: "QuizSession"):
    return {
        "status": session.status,
        "current_question": {
            "id": session.current_question.id,
            "text": session.current_question.text,
            "ui": session.current_question.ui_view,
            "answers": [
                {"text": answer.text, "id": answer.id}
                for answer in session.current_question.answers.all()
            ],
        }
        if session.current_question
        else None,
        "leaderboard": [
            {
                "name": partecipant.name,
                "score": partecipant.score,
                "color": partecipant.color,
            }
            for partecipant in session.leaderboard
        ]
        if session.is_finished
        else None,
        "current_question_changed": session.current_question_changed.isoformat()
        if session.current_question_changed
        else None,
        "seconds_to_answer_question": session.seconds_to_answer_question,
    }
