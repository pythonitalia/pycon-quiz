import { useMachine } from "@xstate/react";

import { gameMachine } from "./game-machine";
import {
  useGameStateSubscription,
  GameStateSubscription,
} from "../../../types";
import { useEffect } from "react";

export const useGameMachine = (sessionId: number) => {
  const [{ data, fetching, error }] = useGameStateSubscription<
    GameStateSubscription
  >({
    variables: {
      sessionId,
    },
  });

  const [current, send] = useMachine(gameMachine);

  useEffect(() => {
    console.log("new data received", data, current);
    if (!data) {
      return;
    }

    if (data.playGame.status === "live") {
      send("live");
    }
  }, [data]);

  return "hello";
};
