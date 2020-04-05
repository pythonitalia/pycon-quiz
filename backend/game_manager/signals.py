import django.dispatch

update_game = django.dispatch.Signal(providing_args=["game",])


def send_update():
    update_game.send(sender=__file__, game=None)


def register_on_update(callback):
    update_game.connect(callback)
