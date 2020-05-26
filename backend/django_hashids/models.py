from django.db.models import Model

from django_hashids.hashids import encode_hashid


class HashidModel(Model):
    @property
    def hashid(self):
        return encode_hashid(self.pk)

    class Meta:
        abstract = True
