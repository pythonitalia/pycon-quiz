from .base import *

DEBUG = False
SECRET_KEY = env("SECRET_KEY")

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

STATIC_HOST = env("CLOUDFRONT_URL")
STATIC_URL = STATIC_HOST + "/static/"
