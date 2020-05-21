import { keyframes } from "@emotion/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "theme-ui";

type Props = {
  countdownFrom: number;
  totalTime: number;
};

export const ChangeAnswerCountdown: React.FC<Props> = ({
  countdownFrom,
  totalTime,
}) => {
  const cachedSecondsLeft = useRef<number>(countdownFrom);
  const animation = useMemo(
    () => keyframes`
        0% {
          transform: scaleX(${
            ((totalTime - countdownFrom) / totalTime) * 100
          }%);
        }
        100% {
          transform: scaleX(0);
        }
    `,
    []
  );

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "0.8rem",
        backgroundColor: "cornflowerBlue",
        animation: `${animation} ${
          totalTime - cachedSecondsLeft.current
        }s linear forwards`,
        transformOrigin: "left",
      }}
    />
  );
};
