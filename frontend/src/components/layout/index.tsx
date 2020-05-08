import React from "react";

import { Background } from "../background";

export const Layout: React.SFC = ({ children }) => (
  <>
    <Background />
    {children}
  </>
);
