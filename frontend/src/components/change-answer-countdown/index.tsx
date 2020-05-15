import { keyframes } from "@emotion/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "theme-ui";

import { GRACE_PERIOD_TO_CHANGE_USER_ANSWER_IN_SECONDS } from "../../utils/constants";

type Props = {
  secondsSinceAnswerSent: number;
};

export const ChangeAnswerCountdown: React.SFC<Props> = ({
  secondsSinceAnswerSent,
}) => {
  const cachedSecondsLeft = useRef<number>(secondsSinceAnswerSent);
  const animation = useMemo(
    () => keyframes`
        0% {
          transform: scaleX(${
            ((GRACE_PERIOD_TO_CHANGE_USER_ANSWER_IN_SECONDS -
              secondsSinceAnswerSent) /
              GRACE_PERIOD_TO_CHANGE_USER_ANSWER_IN_SECONDS) *
            100
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
          30 - cachedSecondsLeft.current
        }s linear forwards`,
        transformOrigin: "left",
      }}
    />
  );
};
