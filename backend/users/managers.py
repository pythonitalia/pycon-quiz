from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_superuser(self, username, password, **extra_fields):
        return self._create_user(
            username=username,
            password=password,
            is_staff=True,
            is_superuser=True,
            **extra_fields
        )

    def create_user(self, username, password, **extra_fields):
        is_staff = extra_fields.pop("is_staff", False)
        return self._create_user(
            username=username,
            password=password,
            is_staff=is_staff,
            is_superuser=False,
            **extra_fields
        )

    def _create_user(self, username, password, is_staff, is_superuser, **extra_fields):
        user = self.model(
            username=username,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save()
        return user
