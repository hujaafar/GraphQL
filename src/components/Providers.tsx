"use client";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { MotionConfig } from "framer-motion";
import { createGraphQLClient } from "@/lib/apollo";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(createGraphQLClient);
  return (
    <ApolloProvider client={client}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ApolloProvider>
  );
}
