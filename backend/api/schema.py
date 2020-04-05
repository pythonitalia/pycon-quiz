import typing
import strawberry

from api.game_manager.subscription import GameManagerSubscription


@strawberry.type
class Query:
    x: int = 5


@strawberry.type
class Subscription(GameManagerSubscription):
    pass


schema = strawberry.Schema(query=Query, subscription=Subscription)
