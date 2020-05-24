import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, Image } from "theme-ui";

import { Answer } from "../../types";

type Props = {
  answer: Answer;
  position: number;
  disableAnswer: boolean;
  onClick: (answerId: string) => void;
};

const LETTTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const COLORS = ["mint", "orange", "red", "azure"];

export const AnswerBox: React.FC<Props> = ({
  answer,
  position,
  disableAnswer,
  onClick,
}) => {
  const [imageUrl, setImageUrl] = useState(answer.smallImage);
  const color = COLORS[position % COLORS.length];

  const onClickWrapper = useCallback(() => {
    onClick(answer.id);
  }, [onClick, answer]);

  useEffect(() => {
    const prefetchImage = new window.Image();
    prefetchImage.src = answer.image;
    prefetchImage.onload = () => {
      setImageUrl(answer.image);
    };
  }, [answer.image]);

  return (
    <Flex
      onClick={onClickWrapper}
      sx={{
        alignItems: "flex-start",
        opacity: disableAnswer ? 0.5 : 1,
        cursor: "pointer",
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
            height: ["20rem", "20rem", "40rem"],
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
