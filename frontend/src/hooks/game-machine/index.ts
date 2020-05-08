import { useMachine } from "@xstate/react";

import { gameMachine } from "./game-machine";
import { useGameStateSubscription, GameStateSubscription } from "../../types";
import { useEffect } from "react";

export const useGameMachine = (sessionId: string) => {
  const [{ data, fetching, error }] = useGameStateSubscription<
    GameStateSubscription
  >({
    variables: {
      sessionId,
    },
  });

  const [current, send] = useMachine(gameMachine);

  useEffect(() => {
    if (!data) {
      return;
    }

    switch (data.playGame.status) {
      case "draft": {
        console.log("send befor estart");
        send("BEFORE_START", { a: 1 });
        break;
      }
      case "live": {
        // if (current current.event.question)
        console.log("send live");
        send("LIVE", { question: data.playGame.currentQuestion });
        break;
      }
    }
  }, [data]);

  return current;
};
