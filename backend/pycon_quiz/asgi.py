"""
ASGI config for pycon_quiz project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/
"""

import logging
import os

from django.core.asgi import get_asgi_application
from starlette.applications import Starlette
from starlette.websockets import WebSocketDisconnect
from strawberry.asgi import GraphQL

from api.schema import schema

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pycon_quiz.settings.dev")

django_application = get_asgi_application()
logging.basicConfig(level=logging.DEBUG)


async def application(scope, receive, send):
    if scope["type"] == "http":
        await django_application(scope, receive, send)
    elif scope["type"] == "websocket":
        try:
            graphql_app = GraphQL(schema, debug=True)
            app = Starlette(debug=True)
            app.add_websocket_route("/graphql", graphql_app)
            await app(scope, receive, send)
        except Exception as e:
            if e == 1001:
                return
        # except WebSocketDisconnect:
        #     pass
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")
