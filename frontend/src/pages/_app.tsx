import React, { useRef } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  createClient,
  Provider,
  defaultExchanges,
  subscriptionExchange,
} from "urql";
import { AppProps } from "next/app";

const App: React.SFC<AppProps> = ({ Component, pageProps }) => {
  const client = useRef(() => {
    const exchanges = [...defaultExchanges];

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

    const client = createClient({
      url: "http://localhost:8000/graphql",
      exchanges,
    });

    return client;
  });

  return (
    <Provider value={client.current()}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
