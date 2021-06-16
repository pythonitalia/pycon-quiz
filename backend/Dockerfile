FROM python:3.8.3

RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY poetry.lock pyproject.toml /app/

WORKDIR /app/

RUN poetry install --no-dev
RUN pip install gunicorn

COPY . /app/

RUN DATABASE_URL='' SECRET_KEY='test' python manage.py collectstatic --noinput

ENV DJANGO_SETTINGS_MODULE=pycon_quiz.settings.prod

EXPOSE 8000

CMD ["gunicorn", "-w", "9", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "pycon_quiz.asgi:application"]
