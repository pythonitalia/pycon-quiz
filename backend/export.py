from quizzes.models import *
import csv

FILE_NAME = "export.csv"
COLUMNS = ("Question", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Correct Answer")
questions = Question.objects.all()


rows = []
for q in questions:
    row = [q.text]
    correct = None
    for a in q.answers.all():
        row.append(a.text)
        if a.is_correct: 
            correct = a.text
    row.append(correct)
    rows.append(row)


with open(FILE_NAME, "w", newline="") as csvfile:
    spamwriter = csv.writer(
        csvfile
    )
    spamwriter.writerow(COLUMNS)
    for row in rows:
        spamwriter.writerow(row)
