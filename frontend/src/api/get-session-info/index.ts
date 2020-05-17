import {
  GetSessionInfoDocument,
  GetSessionInfoQuery,
  QuizSession,
} from "../../types";
import { getGraphQLUrl } from "../../utils/get-graphql-url";

export const getSessionInfo = async (
  sessionId: string
): Promise<QuizSession> => {
  const request = await fetch(getGraphQLUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      variables: {
        sessionId,
      },
      query: GetSessionInfoDocument.loc.source.body,
    }),
  });

  if (request.status !== 200) {
    throw new Error(`Invalid session id (${sessionId})`);
  }

  const sessionInfoBody: GetSessionInfoQuery = (await request.json()).data;

  if (!sessionInfoBody?.session) {
    throw new Error(`Invalid session id (${sessionId})`);
  }

  return sessionInfoBody.session;
};
