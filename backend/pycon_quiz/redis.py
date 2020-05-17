import aioredis

from django.conf import settings

async def get_client():
    return await aioredis.create_redis(settings.REDIS_URL)
