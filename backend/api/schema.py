import typing
import strawberry

from api.game_manager.subscription import GameManagerSubscription
from api.quizzes.mutations import QuizzesMutation
from api.quizzes.queries import QuizzesQuery


@strawberry.type
class Query(QuizzesQuery):
    pass


@strawberry.type
class Subscription(GameManagerSubscription):
    pass


@strawberry.type
class Mutation(QuizzesMutation):
    pass


schema = strawberry.Schema(query=Query, subscription=Subscription, mutation=Mutation)
