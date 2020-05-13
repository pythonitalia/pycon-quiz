import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { useFormState } from "react-use-form-state";
import { Flex, Heading } from "theme-ui";

import { JoinButton } from "../../../components/join-button";
import { NameInput } from "../../../components/name-input";
import { usePlayerData } from "../../../hooks/auth";
import {
  GetSessionInfoDocument,
  GetSessionInfoQuery,
  QuizSession,
  useRegisterForGameMutation,
} from "../../../types";

const COLORS = [
  "#8E76AC",
  "#E38065",
  "#EEB255",
  "#F9E9DF",
  "#6C81E8",
  "#8CCBDE",
  "#77DEBA",
];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export type NameForm = {
  name: string;
  color: string;
};

type Props = {
  quizSession: QuizSession;
};

export const JoinGameScreen: React.FC<Props> = ({ quizSession }) => {
  const router = useRouter();
  const { session } = router.query as { session: string };
  const [formState, { text }] = useFormState<NameForm>({
    color: COLORS[0],
  });
  const { playerData, setLocalData } = usePlayerData(session);
  const [registerForGameResult, registerForGame] = useRegisterForGameMutation();
  const canJoinGame =
    !registerForGameResult.fetching && formState.validity.name;

  useEffect(() => {
    if (playerData.token !== null) {
      router.push("/play/[session]/game", `/play/${session}/game`);
    }
  }, [playerData, session]);

  const onEnter = useCallback(async () => {
    if (!canJoinGame) {
      return;
    }

    const { name, color } = formState.values;

    const response = await registerForGame({
      sessionId: session,
      name,
      color,
    });

    if (response.data.registerForGame.__typename === "Error") {
      formState.setFieldError("name", response.data.registerForGame.message);
      return;
    }

    const { token } = response.data.registerForGame;
    setLocalData(name, token);
  }, [formState.values, canJoinGame]);

  const quizName = quizSession.name;
  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Heading
        sx={{
          letterSpacing: "intro",
          lineHeight: "intro",
          mb: "intro",
        }}
      >
        Pycon Italia
        <br />
        {quizName || "Quiz Ufficiale"}
      </Heading>
      <NameInput
        {...text({
          name: "name",
          onChange: (e) => formState.setField("color", randomColor()),
        })}
        color={formState.values.color}
        error={formState.errors.name}
      />
      <JoinButton onClick={onEnter} disableJoin={!canJoinGame} />
    </Flex>
  );
};

export default JoinGameScreen;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return { props: {} };
};
