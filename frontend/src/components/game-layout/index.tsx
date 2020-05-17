import React from "react";

import { QuizSession } from "../../types";
import { Background } from "../background";
import { TwitchBar } from "../twitch-bar";

type Props = {
  quizSession: QuizSession;
};

export const GameLayout: React.SFC<Props> = ({ children, quizSession }) => {
  return (
    <>
      <Background />

      {children}
      <TwitchBar url={quizSession.streamLink} />
    </>
  );
};
