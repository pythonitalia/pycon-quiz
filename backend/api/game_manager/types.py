from typing import TYPE_CHECKING, List, Optional

import strawberry

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

    @classmethod
    def from_data(cls, data):
        return cls(name=data["name"], score=data["score"])


@strawberry.type
class GameState:
    status: str
    current_question: Optional[Question]
    leaderboard: Optional[List[LeaderboardPartecipant]]

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
            {"name": partecipant.name, "score": partecipant.score}
            for partecipant in session.leaderboard
        ]
        if session.is_finished
        else None,
    }
