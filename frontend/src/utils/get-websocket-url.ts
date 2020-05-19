import { getGraphQLUrl } from "./get-graphql-url";

export const getWebsocketUrl = () => {
  const graphQLUrl = getGraphQLUrl();
  const useSecureWebsocket = graphQLUrl.indexOf("https://") !== -1;

  const protocol = `ws${useSecureWebsocket ? "s" : ""}`;
  const websocketUrl = graphQLUrl
    .replace("https", protocol)
    .replace("http", protocol);
  return websocketUrl;
};
