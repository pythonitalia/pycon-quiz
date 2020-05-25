/* eslint-disable jsx-a11y/accessible-emoji */
import { keyframes } from "@emotion/core";
import React, { useEffect, useState } from "react";
import { Box, Text } from "theme-ui";

type Props = {
  currentPlayerTag: any;
};

type HandDirectionType = "up" | "down" | null;

const handAnimationDown = keyframes`
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-1rem);
  }
`;

const handAnimationUp = keyframes`
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(1rem);
  }
`;

export const NamePositionScrollHelper: React.FC<Props> = ({
  currentPlayerTag,
}) => {
  const [handDirection, setHandDirection] = useState<HandDirectionType>(null);

  useEffect(() => {
    if (!currentPlayerTag) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const positionTop = currentPlayerTag.getBoundingClientRect().top;
        if (entries[0].intersectionRatio === 1) {
          setHandDirection(null);
        } else if (positionTop > 0) {
          setHandDirection("down");
        } else {
          setHandDirection("up");
        }
      },
      {
        threshold: [0.01, 1],
      }
    );

    observer.observe(currentPlayerTag);

    return () => {
      observer.disconnect();
    };
  }, [currentPlayerTag]);

  const handAnimation =
    handDirection === "up" ? handAnimationUp : handAnimationDown;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "2rem",
        right: ["10%", "8%", "10%", "20%"],
        animation: `${handAnimation} 500ms linear alternate infinite`,
      }}
    >
      <Text
        as="span"
        sx={{
          fontSize: "header",
        }}
      >
        {handDirection === "down" && "👇"}
        {handDirection === "up" && "👆"}
      </Text>
    </Box>
  );
};
