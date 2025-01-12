
// src/app/layout.tsx
"use client";

import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
