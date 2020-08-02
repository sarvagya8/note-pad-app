import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { typeDefs, resolvers } from "./clientState";

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  resolvers,
  typeDefs,
});

const defaults = {
  notes: [
    {
      __typename: "Note",
      id: 1,
      title: "First",
      content: "First",
    },
  ],
};

cache.writeData({
  data: defaults,
});
console.log(client);
export default client;
