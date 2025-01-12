import ApolloProvider from "@/graphql/ApolloProvider";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
