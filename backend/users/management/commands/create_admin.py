from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **options):
        if User.objects.filter(username="admin").exists():
            return

        User.objects.create_superuser("admin", "change-on-deploy")
