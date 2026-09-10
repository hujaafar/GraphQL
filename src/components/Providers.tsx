"use client";
import { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { MotionConfig } from "framer-motion";
import { clearSession, getSession, GRAPHQL_ENDPOINT } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => {
    // Read the session for every operation so sign-in and expiry never reuse a stale header.
    const auth = setContext((_, { headers }) => {
      const token = getSession();
      return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
    });
    const errors = onError(({ graphQLErrors, networkError }) => {
      const expired = graphQLErrors?.some(error => ["invalid-jwt", "jwt-expired", "UNAUTHENTICATED"].includes(String(error.extensions?.code))) ||
        (networkError && "statusCode" in networkError && networkError.statusCode === 401);
      if (expired && typeof window !== "undefined") { clearSession(); window.dispatchEvent(new Event("graphite:session-expired")); }
    });
    return new ApolloClient({ link: errors.concat(auth).concat(createHttpLink({ uri: GRAPHQL_ENDPOINT })), cache: new InMemoryCache(), defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "none" } } });
  });
  return <ApolloProvider client={client}><MotionConfig reducedMotion="user">{children}</MotionConfig></ApolloProvider>;
}
