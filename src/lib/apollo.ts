import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { clearSession, getSession, GRAPHQL_ENDPOINT } from "./auth";

export function createGraphQLClient(fetcher: typeof fetch = fetch) {
  const auth = setContext((_, { headers }) => {
    // Resolve the tab's current token for every operation, including manual refreshes.
    const token = getSession();
    return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
  });
  const errors = onError(({ graphQLErrors, networkError }) => {
    const expired =
      graphQLErrors?.some((error) =>
        ["invalid-jwt", "jwt-expired", "UNAUTHENTICATED"].includes(String(error.extensions?.code)),
      ) ||
      (networkError && "statusCode" in networkError && networkError.statusCode === 401);
    if (expired && typeof window !== "undefined") {
      clearSession();
      window.dispatchEvent(new Event("graphite:session-expired"));
    }
  });
  const boundedFetch: typeof fetch = (input, init) => {
    const timeout = AbortSignal.timeout(20000);
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    return fetcher(input, { ...init, signal, cache: "no-store" });
  };
  return new ApolloClient({
    link: errors
      .concat(auth)
      .concat(createHttpLink({ uri: GRAPHQL_ENDPOINT, fetch: boundedFetch })),
    cache: new InMemoryCache(),
    defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "none" } },
  });
}
