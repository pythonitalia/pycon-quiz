import {
  GetSessionInfoDocument,
  GetSessionInfoQuery,
  QuizSession,
} from "../../types";

export const getSessionInfo = async (
  sessionId: string
): Promise<QuizSession> => {
  const request = await fetch("http://localhost:8000/graphql", {
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
