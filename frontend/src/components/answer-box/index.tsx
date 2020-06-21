/* eslint-disable jsx-a11y/accessible-emoji */
import { keyframes } from "@emotion/core";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, Image, Text } from "theme-ui";

import { Answer } from "../../types";

type Props = {
  answer: Answer;
  position: number;
  disableAnswer: boolean;
  selected: boolean;
  onClick: (answerId: string) => void;
  correct: boolean | null;
};

const LETTTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const COLORS = ["mint", "orange", "red", "azure"];

const correctAnswerAnim = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.2) rotate(180deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.5) rotate(0deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
`;

export const AnswerBox: React.FC<Props> = ({
  answer,
  position,
  disableAnswer,
  selected,
  onClick,
  correct,
}) => {
  const [imageUrl, setImageUrl] = useState(answer.smallImage);
  const color = COLORS[position % COLORS.length];

  const onClickWrapper = useCallback(() => {
    onClick(answer.id);
  }, [onClick, answer]);

  useEffect(() => {
    if (answer.image === null) {
      return;
    }

    const prefetchImage = new window.Image();
    prefetchImage.src = answer.image;
    prefetchImage.onload = () => {
      setImageUrl(answer.image);
    };
  }, [answer.image]);

  const isShowingCorrectAnswers = correct !== null;

  return (
    <Flex
      onClick={onClickWrapper}
      sx={{
        position: "relative",
        alignItems: "flex-start",
        opacity: disableAnswer && !correct && !selected ? 0.5 : 1,
        cursor: "pointer",
        filter: isShowingCorrectAnswers && !correct ? "grayscale(1)" : null,
        "&:hover": disableAnswer
          ? {}
          : {
              opacity: 1,
              button: {
                backgroundColor: color,
              },
            },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: color,
          px: "primaryHorizontal",
          py: "primaryVertical",
          textTransform: "uppercase",
          userSelect: "none",
          border: "primary",
          borderRight: 0,
        }}
      >
        {LETTTERS[position]}
      </Box>
      {answer.image && (
        <Box
          sx={{
            border: "primary",
            width: "100%",
            height: ["20rem", "20rem", "35rem"],
            overflow: "hidden",
          }}
        >
          <Image
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter:
                imageUrl === answer.smallImage ? "blur(2rem)" : "blur(0rem)",
              transition: `filter .5s ${position * 100}ms`,
            }}
            src={imageUrl}
            width={answer.imageWidth}
            height={answer.imageHeight}
            alt={answer.text}
          />
        </Box>
      )}
      {!answer.image && (
        <Button
          sx={{
            flexGrow: 1,
            textTransform: "none",
            textAlign: "left",
            border: "primary",
            backgroundColor:
              isShowingCorrectAnswers && (selected || correct)
                ? color
                : "transparent",
            "&:first-letter": {
              textTransform: "uppercase",
            },
          }}
        >
          {answer.text}
        </Button>
      )}
      {correct && (
        <Text
          role="img"
          aria-label="Correct answer"
          sx={{
            position: "absolute",
            bottom: "-1.8rem",
            right: "-1.8rem",
            fontSize: "4.1rem",
            animation: `${correctAnswerAnim} 500ms forwards`,
            userSelect: "none",
          }}
        >
          👍
        </Text>
      )}
    </Flex>
  );
};
