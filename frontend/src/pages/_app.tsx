import { Global } from "@emotion/core";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { AppProps } from "next/app";
import React, { useRef, useState } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ThemeProvider } from "theme-ui";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
  subscriptionExchange,
} from "urql";

import { ConnectionPopup } from "../components/connection-popup";
import { theme } from "../theme";
import { QuizSession } from "../types";
import { getGraphQLUrl } from "../utils/get-graphql-url";
import { getWebsocketUrl } from "../utils/get-websocket-url";

type Props = {
  appProps: {
    quizSession: QuizSession;
  };
};

const App: React.FC<AppProps<Props>> = ({ Component, pageProps }) => {
  const [connectionPopupVisible, showConnectionPopup] = useState(false);
  const client = useRef(() => {
    const exchanges = [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({}),
      fetchExchange,
    ];

    if (typeof window !== "undefined") {
      const subscriptionClient = new SubscriptionClient(getWebsocketUrl(), {
        reconnect: true,
        connectionCallback: () => {
          showConnectionPopup(false);
        },
      });

      subscriptionClient.client.onerror = (e) => {
        showConnectionPopup(true);
      };
      subscriptionClient.client.onclose = (e) => {
        showConnectionPopup(true);
      };

      exchanges.push(
        subscriptionExchange({
          forwardSubscription(operation) {
            return subscriptionClient.request(operation);
          },
        })
      );
    }

    const urqlClient = createClient({
      url: getGraphQLUrl(),
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
        <ConnectionPopup visible={connectionPopupVisible} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
