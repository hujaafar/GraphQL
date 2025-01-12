"use client";

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql", // Replace with your endpoint
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
  },
});

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
