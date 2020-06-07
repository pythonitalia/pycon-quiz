import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useFormState } from "react-use-form-state";
import { Flex, Heading } from "theme-ui";

import { getSessionInfo } from "../../../api/get-session-info";
import { GameLayout } from "../../../components/game-layout";
import { JoinButton } from "../../../components/join-button";
import { NameInput } from "../../../components/name-input";
import { usePlayerData } from "../../../hooks/use-player-data";
import { QuizSession, useRegisterForGameMutation } from "../../../types";

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
const USERNAME_REGEX = /^[a-zA-Z0-9]{2,22}$/;

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
  const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(
    null
  );
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

    console.log("response", response);
    if (response.error) {
      setCustomErrorMessage(response.error.message);
      return;
    }

    if (response.data.registerForGame.__typename === "Error") {
      setCustomErrorMessage(response.data.registerForGame.message);
      return;
    }

    const { token } = response.data.registerForGame;
    setLocalData(name, token);
  }, [formState.values, canJoinGame]);

  const quizName = quizSession.name;
  return (
    <GameLayout quizSession={quizSession}>
      <Flex variant="layouts.main">
        <Heading
          sx={{
            lineHeight: "intro",
            mb: "intro",
          }}
        >
          Pycon Italia
          <br />
          {quizName}
        </Heading>
        <NameInput
          {...text({
            name: "name",
            onChange: (e) => {
              formState.setField("color", randomColor());
              setCustomErrorMessage(null);
            },
            validateOnBlur: false,
            validate: (value, values, event) => {
              if (!value.trim()) {
                return "Insert an username";
              }

              if (value.length < 2 || value.length > 22) {
                return "Max length between 2 and 22 characters";
              }

              if (!USERNAME_REGEX.test(value)) {
                return "Your username contains invalid characters";
              }
            },
          })}
          color={formState.values.color}
          error={formState.errors.name || customErrorMessage}
        />
        <JoinButton onClick={onEnter} disableJoin={!canJoinGame} />
      </Flex>
    </GameLayout>
  );
};

export default JoinGameScreen;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const quizSession = await getSessionInfo(params.session as string);
  return {
    props: {
      quizSession,
    },
  };
};
