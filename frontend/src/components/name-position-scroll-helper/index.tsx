/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from "react";
import { Box, Text } from "theme-ui";

type Props = {
  currentPlayerTag: any;
};

type HandDirectionType = "up" | "down" | null;

export const NamePositionScrollHelper: React.FC<Props> = ({
  currentPlayerTag,
}) => {
  const [handDirection, setHandDirection] = useState<HandDirectionType>(null);

  useEffect(() => {
    if (!currentPlayerTag) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const positionTop = currentPlayerTag.getBoundingClientRect().top;
        if (entries[0].intersectionRatio === 1) {
          setHandDirection(null);
        } else if (positionTop > 0) {
          setHandDirection("down");
        } else {
          setHandDirection("up");
        }
      },
      {
        threshold: [0.01, 1],
      }
    );

    observer.observe(currentPlayerTag);

    return () => {
      observer.disconnect();
    };
  }, [currentPlayerTag]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "3rem",
        right: ["10%", "8%", "10%", "20%"],
      }}
    >
      <Text
        as="span"
        sx={{
          fontSize: "header",
        }}
      >
        {handDirection === "down" && "👇"}
        {handDirection === "up" && "👆"}
      </Text>
    </Box>
  );
};
