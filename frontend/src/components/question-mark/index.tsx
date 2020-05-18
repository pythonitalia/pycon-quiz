import React, { useEffect, useState } from "react";
import { Box } from "theme-ui";

type Props = {};

type RandomPosition = {
  top: number;
  left: number;
  fontSize: number;
  rotation: number;
};

const EMPTY_POSITION = {
  top: 0,
  left: 0,
  fontSize: 0,
  rotation: 0,
};

const randomPosition = (): RandomPosition => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  const top = Math.random() * height;
  const left = Math.random() * width;

  const fontSize = Math.floor(Math.random() * 300 + 200);
  const rotation = Math.random() * 260;

  return {
    top,
    left,
    fontSize,
    rotation,
  };
};

export const QuestionMark: React.SFC<Props> = () => {
  const [{ top, left, fontSize, rotation }, setPosition] = useState<
    RandomPosition
  >(EMPTY_POSITION);

  useEffect(() => {
    setPosition(randomPosition());
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        color: "grey",
        zIndex: -1,
        userSelect: "none",
      }}
      style={{
        top,
        left,
        fontSize: `${fontSize}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      ?
    </Box>
  );
};
