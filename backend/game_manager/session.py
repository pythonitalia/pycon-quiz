from asgiref.sync import sync_to_async


@sync_to_async
def get_session(id: int):
    from quizzes.models import QuizSession

    return (
        QuizSession.objects.prefetch_related("current_question__answers")
        .select_related("quiz", "current_question")
        .get(id=id)
    )
