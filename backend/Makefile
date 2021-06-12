run-server:
	poetry run uvicorn pycon_quiz.asgi:application --port 8100 --reload

run-worker:
	poetry run python manage.py rqworker

run-scheduler:
	poetry run python manage.py rqscheduler -i 1

run-redis:
	docker run --name pyconquiz-redis  -p 6379:6379 -d redis

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
