import django.dispatch

update_game = django.dispatch.Signal(providing_args=["game",])


def send_update():
    pass
    # update_game.send(sender=__file__, game=None)


def register_on_update(callback):
    pass
    # update_game.connect(callback)
