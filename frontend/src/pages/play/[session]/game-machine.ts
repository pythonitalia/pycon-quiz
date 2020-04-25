import { Machine } from "xstate";

export const gameMachine = Machine({
  id: "game",
  initial: "draft",
  states: {
    draft: {
      on: { START: "live" },
    },
    live: {
      on: { END: "complete" },
    },
    complete: {
      type: "final",
    },
  },
});
