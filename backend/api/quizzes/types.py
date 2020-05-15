from typing import List, Optional

import strawberry
from strawberry.types import DateTime


@strawberry.type
class Error:
    message: str


@strawberry.type
class OperationResult:
    ok: bool


@strawberry.type
class Token:
    token: str


@strawberry.type
class PartecipantAnswer:
    id: strawberry.ID
    question_id: strawberry.ID
    answer_id: strawberry.ID
    created: DateTime

    @classmethod
    def from_model(cls, data):
        return cls(
            question_id=data.question_id,
            id=data.id,
            answer_id=data.answer_id,
            created=data.created,
        )


@strawberry.type
class Partecipant:
    id: strawberry.ID
    name: str
    answers: List[PartecipantAnswer]
    session_id: strawberry.ID

    @classmethod
    def from_model(cls, data):
        return cls(
            id=data.id,
            name=data.name,
            answers=[
                PartecipantAnswer.from_model(answer) for answer in data.answers.all()
            ],
            session_id=data.session_id,
        )


@strawberry.type
class QuizSession:
    id: strawberry.ID
    name: Optional[str]
    stream_link: str

    @classmethod
    def from_model(cls, data):
        return cls(id=data.id, name=data.name, stream_link=data.stream_link)
