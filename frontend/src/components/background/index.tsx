import React from "react";
import { Box } from "theme-ui";

import { QuestionMark } from "../question-mark";

type Props = {};

const howManyQuestionMarks = 7;

export const Background: React.SFC<Props> = (props) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: -1,
    }}
  >
    {Array(howManyQuestionMarks)
      .fill(null, 0)
      .map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <QuestionMark key={i} />
      ))}
  </Box>
);
