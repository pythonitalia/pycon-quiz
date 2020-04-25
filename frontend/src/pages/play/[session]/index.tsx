import React from "react";
import Link from "next/link";

export const Session = () => (
  <div>
    <h1>Welcome to the quiz!</h1>
    <input type="text" />
    <Link href="/play/[session]/game" as={`/play/5/game`}>
      <a>Join</a>
    </Link>
  </div>
);

export default Session;
