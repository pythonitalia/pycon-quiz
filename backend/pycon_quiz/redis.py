import aioredis


async def get_client():
    return await aioredis.create_redis("redis://localhost")
