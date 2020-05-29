import React from "react";

import { QuizSession } from "../../types";
import { Background } from "../background";
import { PlayersCount } from "../players-count";
import { TwitchBar } from "../twitch-bar";

type Props = {
  quizSession: QuizSession;
};

export const GameLayout: React.SFC<Props> = ({ children, quizSession }) => {
  return (
    <>
      <Background />
      <PlayersCount sessionId={quizSession.id} />

      {children}
      <TwitchBar url={quizSession.streamLink} />
    </>
  );
};
