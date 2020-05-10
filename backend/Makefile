run-server:
	poetry run uvicorn pycon_quiz.asgi:application --reload

load-demodata:
	poetry run python manage.py loaddata demodata.json

generate-demodata:
	poetry run python manage.py dumpdata quizzes.Quiz quizzes.Question quizzes.Answer > demodata.json

