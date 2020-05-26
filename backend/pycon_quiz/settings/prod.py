from .base import *

DEBUG = False
SECRET_KEY = env("SECRET_KEY")

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
AWS_S3_CUSTOM_DOMAIN = f"d2x84vjkgthxda.cloudfront.net"
DEFAULT_FILE_STORAGE = "pycon_quiz.storages.MediaStorage"
