FROM python:3.8.3

RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY poetry.lock pyproject.toml /app/

WORKDIR /app/

RUN poetry install

COPY . /app/

ENV DJANGO_SETTINGS_MODULE=pycon_quiz.settings.prod

EXPOSE 8000

CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8000", "pycon_quiz.asgi:application"]
