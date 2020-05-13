import { Global } from "@emotion/core";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { AppProps, default as BaseApp } from "next/app";
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

import { getSessionInfo } from "../api/get-session-info";
import { Layout } from "../components/layout";
import { theme } from "../theme";
import { QuizSession } from "../types";

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
      requestPolicy: "cache-first",
    });

    return urqlClient;
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider value={client.current()}>
        <Layout quizSession={pageProps.quizSession}>
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

App.getInitialProps = async (ctx) => {
  const appProps = await BaseApp.getInitialProps(ctx);
  const quizSession = await getSessionInfo(ctx.router.query.session as string);
  return {
    pageProps: {
      quizSession,
    },
    appProps: {
      ...appProps,
    },
  };
};
