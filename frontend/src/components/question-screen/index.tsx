import React, { useCallback, useEffect, useState } from "react";
import { Flex, Grid, Heading } from "theme-ui";

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
};

export const QuestionScreen: React.SFC<Props> = ({
  question,
  sessionId,
  playerData,
  currentQuestionChanged,
  secondsToAnswerQuestion,
  canAnswerQuestion,
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
    <Flex
      sx={{
        minHeight: "100vh",
        height: ["auto", "auto", "auto", "100vh"],
        maxWidth: "100rem",
        width: "100%",
        mx: "auto",
        px: "primary",
        py: "secondary",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {secondsSinceQuestionVisible !== -1 && (
        <ChangeAnswerCountdown
          key={`answer-countdown-for-${question.id}`}
          totalTime={secondsToAnswerQuestion}
          countdownFrom={secondsSinceQuestionVisible}
        />
      )}
      <Heading
        sx={{
          textTransform: "none",
          mb: "secondary",
        }}
      >
        {question.text}
      </Heading>
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
            disableAnswer={
              !canAnswerQuestion ||
              (typeof selectedAnswerId !== "undefined" &&
                answer.id !== selectedAnswerId)
            }
            onClick={onSelectAnswer}
          />
        ))}
      </Grid>
    </Flex>
  );
};
