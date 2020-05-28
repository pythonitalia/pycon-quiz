import factory
from factory.django import DjangoModelFactory
from faker import Factory as FakerFactory
from pytest_factoryboy import register

from quizzes.models import Answer, Partecipant, Question, Quiz, QuizSession, UserAnswer

faker = FakerFactory.create()


@register
class QuizFactory(DjangoModelFactory):
    name = factory.LazyAttribute(lambda x: faker.name())
    slug = factory.LazyAttribute(lambda x: faker.slug())

    class Meta:
        model = Quiz


@register
class QuestionFactory(DjangoModelFactory):
    quiz = factory.SubFactory(QuizFactory)
    text = factory.LazyAttribute(lambda x: faker.text())
    ui_view = "list"
    position = 0

    class Meta:
        model = Question


@register
class AnswerFactory(DjangoModelFactory):
    question = factory.SubFactory(QuestionFactory)
    text = factory.LazyAttribute(lambda x: faker.text())
    position = 0
    is_correct = False

    class Meta:
        model = Answer


@register
class QuizSessionFactory(DjangoModelFactory):
    name = factory.LazyAttribute(lambda x: faker.name())
    quiz = factory.SubFactory(QuizFactory)
    stream_link = factory.LazyAttribute(lambda x: faker.url())

    class Meta:
        model = QuizSession


@register
class PartecipantFactory(DjangoModelFactory):
    name = factory.LazyAttribute(lambda x: faker.name())
    session = factory.SubFactory(QuizSessionFactory)
    color = "#000000"

    class Meta:
        model = Partecipant


@register
class UserAnswerFactory(DjangoModelFactory):
    class Meta:
        model = UserAnswer
