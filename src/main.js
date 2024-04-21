import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import App from "./App.vue";

const cache = new InMemoryCache();

const server = {
  url: import.meta.env.VITE_SERVER_ADDRESS,
  port: "8888",
};

const apolloClient = new ApolloClient({
  cache,
  uri: `${server.url}:${server.port}/graphql`,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.mount("#app");
