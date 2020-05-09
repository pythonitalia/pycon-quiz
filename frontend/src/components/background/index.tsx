import React from "react";
import { Box } from "theme-ui";

import { QuestionMark } from "../question-mark";

type Props = {};

export const Background: React.SFC<Props> = (props) => {
  const howManyQuestionMarks = 7;

  return (
    <Box>
      {Array(howManyQuestionMarks)
        .fill(null, 0)
        .map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <QuestionMark key={i} />
        ))}
    </Box>
  );
};
