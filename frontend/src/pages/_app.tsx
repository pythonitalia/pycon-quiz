import { Global } from "@emotion/core";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { AppProps } from "next/app";
import React, { useRef } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ThemeProvider } from "theme-ui";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
} from "urql";

import { theme } from "../theme";
import { QuizSession } from "../types";
import { getGraphQLUrl } from "../utils/get-graphql-url";
import { getWebsocketDomain } from "../utils/get-websocket-domain";

type Props = {
  appProps: {
    quizSession: QuizSession;
  };
};

const App: React.FC<AppProps<Props>> = ({ Component, pageProps }) => {
  const client = useRef(() => {
    const exchanges = [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({}),
      fetchExchange,
    ];

    const graphQLUrl = getGraphQLUrl();
    const websocketDomain = getWebsocketDomain();

    if (typeof window !== "undefined") {
      const subscriptionClient = new SubscriptionClient(
        `ws://${websocketDomain}/graphql`,
        {
          reconnect: true,
        }
      );

      exchanges.push(
        subscriptionExchange({
          forwardSubscription(operation) {
            return subscriptionClient.request(operation);
          },
        })
      );
    }

    const urqlClient = createClient({
      url: graphQLUrl,
      // @ts-ignore
      exchanges,
      requestPolicy: "cache-first",
    });

    return urqlClient;
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider value={client.current()}>
        <Global
          styles={() => ({
            html: {
              fontSize: "62.5%",
            },
          })}
        />
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
