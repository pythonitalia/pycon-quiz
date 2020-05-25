import { assign, Machine } from "xstate";

import { GameState, LeaderboardPartecipant, Question } from "../../types";

type Context = {
  question: Question | null;
  leaderboard: LeaderboardPartecipant[] | null;
  currentQuestionChanged: string | null;
  secondsToAnswerQuestion: number;
  canAnswerQuestion: boolean;
};

export const gameMachine = Machine<Context>({
  id: "game",
  initial: "unknown",
  context: {
    question: null,
    leaderboard: null,
    currentQuestionChanged: null,
    secondsToAnswerQuestion: 30,
    canAnswerQuestion: false,
  },
  states: {
    unknown: {
      on: {
        BEFORE_START: "before_start",
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
            currentQuestionChanged: (_, event) => event.currentQuestionChanged,
            secondsToAnswerQuestion: (_, event) =>
              event.secondsToAnswerQuestion,
            canAnswerQuestion: (_, event) => event.canAnswerQuestion,
          }),
        },
        SHOW_LEADERBOARD: {
          target: "show_leaderboard",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
      },
    },
    before_start: {
      on: {
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
            currentQuestionChanged: (_, event) => event.currentQuestionChanged,
            secondsToAnswerQuestion: (_, event) =>
              event.secondsToAnswerQuestion,
            canAnswerQuestion: (_, event) => event.canAnswerQuestion,
          }),
        },
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
      },
    },
    live: {
      on: {
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
            currentQuestionChanged: (_, event) => event.currentQuestionChanged,
            secondsToAnswerQuestion: (_, event) =>
              event.secondsToAnswerQuestion,
            canAnswerQuestion: (_, event) => event.canAnswerQuestion,
          }),
        },
        SHOW_LEADERBOARD: {
          target: "show_leaderboard",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
      },
    },
    show_leaderboard: {
      on: {
        LIVE: {
          target: "live",
          actions: assign({
            question: (_, event) => event.question,
            currentQuestionChanged: (_, event) => event.currentQuestionChanged,
            secondsToAnswerQuestion: (_, event) =>
              event.secondsToAnswerQuestion,
            canAnswerQuestion: (_, event) => event.canAnswerQuestion,
          }),
        },
        COMPLETE: {
          target: "complete",
          actions: assign({
            leaderboard: (_, event) => event.leaderboard,
          }),
        },
      },
    },
    complete: {
      type: "final",
    },
  },
});
