import React from "react";
import { Button, Flex, Text } from "theme-ui";

type Props = {
  onClick: () => void;
  disableJoin: boolean;
};

export const JoinButton: React.SFC<Props> = ({ onClick, disableJoin }) => (
  <Flex
    sx={{
      mt: "intro",
      alignItems: "center",
    }}
  >
    <Text
      sx={{
        fontWeight: "bold",
        mr: "primary",
      }}
    >
      Ready?
    </Text>
    <Button disabled={disableJoin} onClick={onClick}>
      Enter
    </Button>
  </Flex>
);
