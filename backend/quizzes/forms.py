import base64
from io import BytesIO

from django.forms import ModelForm
from PIL import Image

from game_manager.publisher import send_update
from quizzes.models import Answer, QuizSession


class QuizSessionForm(ModelForm):
    class Meta:
        model = QuizSession
        fields = "__all__"

    def save(self, commit=True):
        result = super().save(commit=commit)

        send_update_when_changing = (
            "seconds_to_answer_question",
            "current_question_changed",
        )

        if any([event in self.changed_data for event in send_update_when_changing]):
            send_update.delay(session=self.instance)

        return result


class AnswerInlineForm(ModelForm):
    class Meta:
        model = Answer
        fields = "__all__"
        exclude = ["image_width", "image_height", "image_format", "small_image"]

    def clean(self):
        cleaned_data = super().clean()

        if "image" in self.changed_data:
            field = cleaned_data["image"]
            image = field.image

            self.instance.image_width = image.width
            self.instance.image_height = image.height
            self.instance.image_format = image.format

            aspect_ratio = image.width / image.height
            new_height = int(50 / aspect_ratio)
            small_image = Image.open(field.file).resize((50, new_height))

            buffer = BytesIO()
            small_image.save(buffer, format=image.format)

            encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
            self.instance.small_image = f"data:image/{image.format};base64,{encoded}"

        return cleaned_data
