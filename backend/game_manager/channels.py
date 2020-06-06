def get_redis_channel_name_for_session_id(id: int):
    return f"gamesession:{id}"


def get_redis_channel_name_for_session_id_player_counts(id: int):
    return f"gamesession-playerscount:{id}"
