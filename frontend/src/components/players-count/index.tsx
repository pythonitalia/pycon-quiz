import React from "react";
import { Box } from "theme-ui";

import {
  PlayersCountSubscription,
  usePlayersCountSubscription,
} from "../../types";
import { EmojiLoading } from "../emoji-loading";

type Props = {
  sessionId: string;
};

export const PlayersCount: React.FC<Props> = ({ sessionId }) => {
  // const data = null;
  const [{ data, fetching, error }] = usePlayersCountSubscription<
    PlayersCountSubscription
  >({
    variables: {
      sessionId,
    },
  });

  console.log("data", data, "fetching", fetching, "error", error);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "secondary",
        right: "secondary",
      }}
    >
      {!data && <EmojiLoading />}
      {data && data.playersCount} playing
    </Box>
  );
};
