import React from "react";
import { useRouter } from "next/router";
import { useGameMachine } from "./hooks";

export const Game = () => {
  const router = useRouter();
  const { session } = router.query;
  const sessionId = parseInt(session as string, 10);

  const hello = useGameMachine(sessionId);

  console.log("data", hello);

  return (
    <div>
      <h1>Wait</h1>
    </div>
  );
};

export default Game;
