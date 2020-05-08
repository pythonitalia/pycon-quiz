import { Global } from "@emotion/core";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { AppProps } from "next/app";
import React, { useRef } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ThemeProvider } from "theme-ui";
import {
  createClient,
  defaultExchanges,
  Provider,
  subscriptionExchange,
} from "urql";

import { Layout } from "../components/layout";
import { theme } from "../theme";

const App: React.SFC<AppProps> = ({ Component, pageProps }) => {
  const client = useRef(() => {
    const exchanges = [
      devtoolsExchange,
      cacheExchange({}),
      ...defaultExchanges,
    ];

    if (typeof window !== "undefined") {
      const subscriptionClient = new SubscriptionClient(
        "ws://localhost:8000/graphql",
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
      url: "http://localhost:8000/graphql",
      // @ts-ignore
      exchanges,
    });

    return urqlClient;
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider value={client.current()}>
        <Layout>
          <Global
            styles={() => ({
              html: {
                fontSize: "62.5%",
              },
            })}
          />
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
