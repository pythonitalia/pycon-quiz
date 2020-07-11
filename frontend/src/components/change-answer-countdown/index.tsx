import { keyframes } from "@emotion/core";
import React, { useEffect, useMemo, useRef } from "react";
import { Box } from "theme-ui";
import useSound from "use-sound";

type Props = {
  countdownFrom: number;
  totalTime: number;
};

export const ChangeAnswerCountdown: React.FC<Props> = ({
  countdownFrom,
  totalTime,
}) => {
  // TODO playing sound causes render every time (?)
  const [playCountdown, { stop }] = useSound("/time-left-countdown.mp3", {
    interrupt: true,
    volume: 0.5,
  });

  const timeLeft = totalTime - countdownFrom;
  const cachedSecondsLeft = useRef<number>(countdownFrom);
  const animation = useMemo(
    () => keyframes`
        0% {
          transform: scaleX(${(timeLeft / totalTime) * 100}%);
        }

        70% {
          background-color: cornflowerBlue;
        }

        75% {
          background-color: #E86C6C;
        }

        100% {
          background-color: #E86C6C;
          transform: scaleX(0);
        }
    `,
    []
  );

  useEffect(() => {
    let timer = null;
    let interval = null;

    const countdownTimer = () => {
      interval = setInterval(() => {
        playCountdown();
      }, 1000);
    };

    if (timeLeft > 5) {
      timer = setTimeout(countdownTimer, (timeLeft - 5) * 1000);
    } else {
      countdownTimer();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdownFrom, totalTime]);

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
