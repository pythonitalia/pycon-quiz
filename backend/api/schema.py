import typing
import strawberry

from api.game_manager.subscription import GameManagerSubscription
from api.quizzes.mutations import QuizzesMutation


@strawberry.type
class Query:
    x: int = 5


@strawberry.type
class Subscription(GameManagerSubscription):
    pass


@strawberry.type
class Mutation(QuizzesMutation):
    pass


schema = strawberry.Schema(query=Query, subscription=Subscription, mutation=Mutation)
