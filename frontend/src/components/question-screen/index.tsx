import React, { useCallback, useState } from "react";
import { Flex, Grid, Heading } from "theme-ui";

import { PlayerData } from "../../hooks/auth";
import { Question, useAnswerQuestionMutation } from "../../types";
import { AnswerBox } from "../answer-box";

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
  const selectedAnswerId = playerData.answers?.find(
    (a) => a.questionId === question.id
  )?.answerId;
  const [_, answerQuestion] = useAnswerQuestionMutation();
  const onSelectAnswer = useCallback((answerIndex) => {
    const answerId = question.answers[answerIndex].id;
    answerQuestion({
      answerId,
      questionId: question.id,
      token: playerData.token,
      sessionId,
    });
  }, []);

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
          gridTemplateColumns: ["1fr", "1fr", "1fr 1fr"],
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
