import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ParticipantAnswer, useGetUserQuery } from "../../types";

export type LocalData = {
  name?: string;
  token: string;
};

export type PlayerData = LocalData & {
  loaded: boolean;
  answers?: ParticipantAnswer[];
};

const getLocalStorageKey = (sessionId: string) => `gameState:${sessionId}`;
export const getUserToken = (sessionId: string): string =>
  JSON.parse(window.localStorage.getItem(getLocalStorageKey(sessionId))).token;

const EMPTY_PLAYER = { token: null, loaded: false };

export const usePlayerData = (
  sessionId: string
): {
  playerData: PlayerData | null;
  setLocalData: (name: string, token: string) => void;
} => {
  const router = useRouter();
  const { token } = router.query as { token: string };

  const localStorageKey = getLocalStorageKey(sessionId);
  const [localData, setData] = useState<LocalData>(
    typeof window === "undefined"
      ? {}
      : token ? { name: 'OBS', token } : JSON.parse(window.localStorage.getItem(localStorageKey))
  );
  const hasLocalData = localData && localData.token;

  const setLocalData = (name: string, token: string) => {
    const newPlayerData = {
      name,
      token,
    };

    setData(newPlayerData);
  };

  const clearLocalData = () => {
    setData(null);
  };

  useEffect(() => {
    if (!localData) {
      window.localStorage.removeItem(localStorageKey);
      return;
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(localData));
  }, [localData]);

  const [userDataFromBackend] = useGetUserQuery({
    variables: {
      token: localData && localData.token,
    },
    pause: !hasLocalData,
  });

  let playerData: PlayerData = {
    ...localData,
    loaded: false,
  };

  if (userDataFromBackend.data) {
    const { me } = userDataFromBackend.data;

    if (me === null) {
      // TODO: Improve this flow, it's very mixed up right now
      window.localStorage.removeItem(localStorageKey);
      playerData = EMPTY_PLAYER;
    } else {
      playerData = {
        ...playerData,
        loaded: true,
        ...me,
      };
    }
  }

  return {
    playerData: hasLocalData ? playerData : { token: null, loaded: false },
    setLocalData,
  };
};
