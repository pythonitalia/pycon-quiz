from datetime import datetime
from typing import List, Optional

import strawberry

from django_hashids.hashids import encode_hashid


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
class ParticipantAnswer:
    id: strawberry.ID
    question_id: strawberry.ID
    answer_id: strawberry.ID
    created: datetime

    @classmethod
    def from_model(cls, data):
        return cls(
            question_id=encode_hashid(data.question_id),
            id=data.hashid,
            answer_id=encode_hashid(data.answer_id),
            created=data.created,
        )


@strawberry.type
class Participant:
    id: strawberry.ID
    name: str
    answers: List[ParticipantAnswer]
    session_id: strawberry.ID

    @classmethod
    def from_model(cls, data):
        return cls(
            id=data.hashid,
            name=data.name,
            answers=[
                ParticipantAnswer.from_model(answer) for answer in data.answers.all()
            ],
            session_id=encode_hashid(data.session_id),
        )


@strawberry.type
class QuizSession:
    id: strawberry.ID
    name: Optional[str]
    stream_link: str

    @classmethod
    def from_model(cls, data):
        return cls(id=data.hashid, name=data.name, stream_link=data.stream_link,)
