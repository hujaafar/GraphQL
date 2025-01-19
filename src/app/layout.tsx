"use client";

import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

let client: ApolloClient<any>;

// If we’re in the browser, read localStorage. Otherwise, skip it.
if (typeof window !== "undefined") {
  const token = localStorage.getItem("authToken") || "";
  client = new ApolloClient({
    link: createHttpLink({
      uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    cache: new InMemoryCache(),
  });
} else {
  // Server-side fallback: no localStorage
  client = new ApolloClient({
    link: createHttpLink({
      uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
    }),
    cache: new InMemoryCache(),
  });
}

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
