run-server:
	poetry run uvicorn pycon_quiz.asgi:application --reload

run-worker:
	poetry run python manage.py rqworker

run-scheduler:
	poetry run python manage.py rqscheduler -i 1

load-demodata:
	poetry run python manage.py loaddata demodata.json

generate-demodata:
	poetry run python manage.py dumpdata quizzes.Quiz quizzes.Question quizzes.Answer > demodata.json

docker-login:
	aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 193264398822.dkr.ecr.eu-west-1.amazonaws.com

docker-build:
	docker build -t 193264398822.dkr.ecr.eu-west-1.amazonaws.com/pyconquiz:latest .

docker-publish:
	docker push 193264398822.dkr.ecr.eu-west-1.amazonaws.com/pyconquiz:latest

tests:
	poetry run pytest --cov-report xml --cov=.
