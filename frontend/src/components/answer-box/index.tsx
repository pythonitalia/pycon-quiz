import React, { useCallback } from "react";
import { Box, Button, Flex, Image } from "theme-ui";

import { Answer } from "../../types";

type Props = {
  answer: Answer;
  position: number;
  selected: boolean;
  answerChoosen: boolean;
  onClick: (answerId: string) => void;
};

const LETTTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const COLORS = ["mint", "orange", "red", "azure"];

export const AnswerBox: React.SFC<Props> = ({
  answer,
  position,
  selected,
  answerChoosen,
  onClick,
}) => {
  const color = COLORS[position % COLORS.length];

  const onClickWrapper = useCallback(() => {
    onClick(answer.id);
  }, [onClick, answer]);

  return (
    <Flex
      onClick={onClickWrapper}
      sx={{
        alignItems: "flex-start",
        opacity: !answerChoosen || selected ? 1 : 0.5,
        cursor: "pointer",
        "&:hover": {
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
        <Image
          sx={{
            border: "primary",
            objectFit: "cover",
            width: "100%",
            height: ["20rem", "20rem", "40rem"],
          }}
          src={answer.image}
          width={answer.imageWidth}
          height={answer.imageHeight}
          alt={answer.text}
        />
      )}
      {!answer.image && (
        <Button
          sx={{
            flexGrow: 1,
            textTransform: "none",
            backgroundColor: "transparent",
            textAlign: "left",
            border: "primary",

            "&:first-letter": {
              textTransform: "uppercase",
            },
          }}
        >
          {answer.text}
        </Button>
      )}
    </Flex>
  );
};
