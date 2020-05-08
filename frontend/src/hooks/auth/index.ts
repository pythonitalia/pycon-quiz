import { useState, useEffect } from "react";
import { useGetUserQuery, PartecipantAnswer } from "../../types";

export type LocalData = {
  name?: string;
  token: string;
};

export type PlayerData = LocalData & {
  loaded: boolean;
  answers?: PartecipantAnswer[];
};

const getLocalStorageKey = (sessionId: string) => `gameState:${sessionId}`;

export const usePlayerData = (
  sessionId: string
): {
  playerData: PlayerData | null;
  setLocalData: (name: string, token: string) => void;
} => {
  const localStorageKey = getLocalStorageKey(sessionId);
  const [localData, setData] = useState<LocalData>(
    typeof window === "undefined"
      ? {}
      : JSON.parse(window.localStorage.getItem(localStorageKey))
  );
  const hasLocalData = localData && localData.token;

  const setLocalData = (name: string, token: string) => {
    const newPlayerData = {
      name,
      token,
    };

    setData(newPlayerData);
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
    requestPolicy: "cache-first",
  });

  let playerData: PlayerData = {
    ...localData,
    loaded: false,
  };

  if (userDataFromBackend.data) {
    const { me } = userDataFromBackend.data;

    playerData = {
      ...playerData,
      loaded: true,
      ...me,
    };
  }

  return {
    playerData: hasLocalData ? playerData : { token: null, loaded: false },
    setLocalData,
  };
};
