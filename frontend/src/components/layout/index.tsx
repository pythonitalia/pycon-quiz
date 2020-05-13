import React from "react";

import { QuizSession } from "../../types";
import { Background } from "../background";
import { TwitchBar } from "../twitch-bar";

type Props = {
  quizSession: QuizSession;
};

export const Layout: React.FC<Props> = ({ children, quizSession }) => (
  <>
    <Background />
    {children}
    <TwitchBar url={quizSession.streamLink} />
  </>
);
