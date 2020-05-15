import React, { useCallback, useState } from "react";
import { Flex, Grid, Heading } from "theme-ui";

import { PlayerData } from "../../hooks/auth";
import { Question, useAnswerQuestionMutation } from "../../types";
import { GRACE_PERIOD_TO_CHANGE_USER_ANSWER_IN_SECONDS } from "../../utils/constants";
import { AnswerBox } from "../answer-box";
import { ChangeAnswerCountdown } from "../change-answer-countdown";

type Props = {
  question: Question;
  sessionId: string;
  playerData: PlayerData;
};

export const QuestionScreen: React.SFC<Props> = ({
  question,
  sessionId,
  playerData,
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

  const createdTimestamp = Date.parse(playerAnswerForQuestion?.created);
  let secondsSinceAnswerSent = -1;

  if (!Number.isNaN(createdTimestamp)) {
    secondsSinceAnswerSent = Math.floor((Date.now() - createdTimestamp) / 1000);
  }

  if (secondsSinceAnswerSent > GRACE_PERIOD_TO_CHANGE_USER_ANSWER_IN_SECONDS) {
    secondsSinceAnswerSent = -1;
  }

  return (
    <Flex
      sx={{
        height: "100vh",
        maxWidth: "100rem",
        width: "100%",
        mx: "auto",
        px: "primary",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {secondsSinceAnswerSent !== -1 && (
        <ChangeAnswerCountdown
          key={`answer-countdown-for-${question.id}`}
          secondsSinceAnswerSent={secondsSinceAnswerSent}
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
            answerChoosen={typeof selectedAnswerId !== "undefined"}
            selected={answer.id === selectedAnswerId}
            onClick={onSelectAnswer}
          />
        ))}
      </Grid>
    </Flex>
  );
};
