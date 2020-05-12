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
  useRegisterForGameMutation,
} from "../../../types";

export type NameForm = {
  name: string;
};

type Props = {
  sessionName: string;
};

export const JoinGameScreen: React.FC<Props> = ({ sessionName }) => {
  const router = useRouter();
  const { session } = router.query as { session: string };
  const [formState, { text }] = useFormState<NameForm>();
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

    const { name } = formState.values;

    const response = await registerForGame({
      sessionId: session,
      name,
    });

    if (response.data.registerForGame.__typename === "Error") {
      formState.setFieldError("name", response.data.registerForGame.message);
      return;
    }

    const { token } = response.data.registerForGame;
    setLocalData(name, token);
  }, [formState.values, canJoinGame]);

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
        {sessionName || "Quiz Ufficiale"}
      </Heading>
      <NameInput {...text("name")} error={formState.errors.name} />
      <JoinButton onClick={onEnter} disableJoin={!canJoinGame} />
    </Flex>
  );
};

export default JoinGameScreen;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const request = await fetch("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      variables: {
        sessionId: params.session,
      },
      query: GetSessionInfoDocument.loc.source.body,
    }),
  });

  if (request.status !== 200) {
    return { props: {} };
  }

  const sessionInfoBody: GetSessionInfoQuery = (await request.json()).data;

  return {
    props: {
      sessionName: sessionInfoBody.session?.name ?? null,
    },
  };
};
