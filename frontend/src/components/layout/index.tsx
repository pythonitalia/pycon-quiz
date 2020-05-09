import React from "react";

import { Background } from "../background";
import { TwitchBar } from "../twitch-bar";

export const Layout: React.SFC = ({ children }) => (
  <>
    <Background />
    {children}
    <TwitchBar />
  </>
);
