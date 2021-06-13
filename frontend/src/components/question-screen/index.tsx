import React, { useCallback } from "react";
import { Flex, Grid, Text, Box } from "theme-ui";
import ReactMarkdown from "react-markdown";

import { PlayerData } from "../../hooks/use-player-data";
import { Question, useAnswerQuestionMutation } from "../../types";
import { AnswerBox } from "../answer-box";
import { ChangeAnswerCountdown } from "../change-answer-countdown";

type Props = {
  question: Question;
  sessionId: string;
  playerData: PlayerData;
  currentQuestionChanged: string | null;
  secondsToAnswerQuestion: number;
  canAnswerQuestion: boolean;
  showNotes?: boolean;
};

export const QuestionScreen: React.SFC<Props> = ({
  question,
  sessionId,
  playerData,
  currentQuestionChanged,
  secondsToAnswerQuestion,
  canAnswerQuestion,
  showNotes = false,
}) => {
  const playerAnswerForQuestion = playerData.answers?.find(
    (a) => a.questionId === question.id
  );
  const selectedAnswerId = playerAnswerForQuestion?.answerId;
  const [_, answerQuestion] = useAnswerQuestionMutation();
  const onSelectAnswer = useCallback(
    (answerId) => {
      answerQuestion({
        answerId,
        questionId: question.id,
        token: playerData.token,
        sessionId,
      });
    },
    [question, playerData, sessionId]
  );

  const createdTimestamp = new Date(currentQuestionChanged);

  let secondsSinceQuestionVisible = -1;

  if (createdTimestamp !== null) {
    secondsSinceQuestionVisible = Math.floor(
      (Date.now() - createdTimestamp.getTime()) / 1000
    );
  }

  if (secondsSinceQuestionVisible > secondsToAnswerQuestion) {
    secondsSinceQuestionVisible = -1;
  }

  return (
    <Flex variant="layouts.main">
      {secondsSinceQuestionVisible !== -1 && (
        <ChangeAnswerCountdown
          key={`answer-countdown-for-${question.id}`}
          totalTime={secondsToAnswerQuestion}
          countdownFrom={secondsSinceQuestionVisible}
        />
      )}
      <ReactMarkdown>{question.text}</ReactMarkdown>
      <Grid
        sx={{
          maxWidth: "70rem",
          width: "100%",
          gridTemplateColumns:
            question.ui === "list" ? "1fr" : ["1fr", "1fr", "1fr 1fr"],
          gridGap: "secondary",
          alignItems: "flex-start",
        }}
      >
        {question.answers.map((answer, index) => (
          <AnswerBox
            key={answer.id}
            position={index}
            answer={answer}
            correct={answer.isCorrect}
            disableAnswer={
              (!answer.isCorrect && !canAnswerQuestion) ||
              typeof selectedAnswerId !== "undefined"
            }
            selected={
              typeof selectedAnswerId !== "undefined" &&
              answer.id === selectedAnswerId
            }
            onClick={onSelectAnswer}
          />
        ))}
      </Grid>
      {showNotes && (
        <Box
          sx={{
            mt: "primary",
            flexShrink: 0,
            maxWidth: "70rem",
            width: "100%",
            px: "primaryHorizontal",
            py: "primaryVertical",
            userSelect: "none",
            border: "4px dashed #E5E5E5",
            fontSize: "small",

            filter: "grayscale(1)",
          }}
        >
          <Text
            sx={{
              fontSize: "small",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Question's notes for the Game Manager
          </Text>
          <Text
            sx={{
              fontWeight: "normal",
              fontSize: "smaller",
            }}
          >
            <ReactMarkdown>{question.note}</ReactMarkdown>
          </Text>
        </Box>
      )}
    </Flex>
  );
};
