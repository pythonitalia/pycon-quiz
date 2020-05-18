from .base import *

DEBUG = False
SECRET_KEY = env("SECRET_KEY")

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
