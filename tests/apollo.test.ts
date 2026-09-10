import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { gql } from "@apollo/client";
import { createGraphQLClient } from "../src/lib/apollo";
import { getSession, saveSession } from "../src/lib/auth";

function installBrowser() {
  const session = new Map<string, string>();
  const store = {
    getItem: (key: string) => session.get(key) ?? null,
    setItem: (key: string, value: string) => {
      session.set(key, value);
    },
    removeItem: (key: string) => {
      session.delete(key);
    },
  };
  Object.defineProperty(globalThis, "sessionStorage", { value: store, configurable: true });
  Object.defineProperty(globalThis, "localStorage", {
    value: { removeItem() {} },
    configurable: true,
  });
  const events = new EventTarget();
  Object.defineProperty(globalThis, "window", { value: events, configurable: true });
  return events;
}
const jwt = (sub: string) =>
  `e30.${Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.test`;
const query = gql`
  query Ping {
    ping
  }
`;
afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "sessionStorage");
  Reflect.deleteProperty(globalThis, "localStorage");
});

test("Apollo resolves the latest token for every request, including token replacement", async () => {
  installBrowser();
  const seen: (string | null)[] = [];
  const client = createGraphQLClient(async (_, init) => {
    seen.push(new Headers(init?.headers).get("authorization"));
    assert.equal(init?.cache, "no-store");
    assert.ok(init?.signal);
    return new Response(JSON.stringify({ data: { ping: "ok" } }), {
      headers: { "content-type": "application/json" },
    });
  });
  const first = jwt("one");
  const second = jwt("two");
  saveSession(first);
  await client.query({ query, fetchPolicy: "network-only" });
  saveSession(second);
  await client.query({ query, fetchPolicy: "network-only" });
  assert.deepEqual(seen, [`Bearer ${first}`, `Bearer ${second}`]);
  client.stop();
});

test("an invalid-jwt response clears the session and signals the profile guard", async () => {
  const events = installBrowser();
  saveSession(jwt("one"));
  let expired = false;
  events.addEventListener("graphite:session-expired", () => {
    expired = true;
  });
  const client = createGraphQLClient(
    async () =>
      new Response(
        JSON.stringify({ errors: [{ message: "Expired", extensions: { code: "invalid-jwt" } }] }),
        { headers: { "content-type": "application/json" } },
      ),
  );
  await assert.rejects(client.query({ query, fetchPolicy: "network-only" }));
  assert.equal(getSession(), null);
  assert.equal(expired, true);
  client.stop();
});

test("API outages do not erase a valid session or return sample data", async () => {
  installBrowser();
  const token = jwt("one");
  saveSession(token);
  const client = createGraphQLClient(
    async () => new Response("Service unavailable", { status: 503 }),
  );
  await assert.rejects(client.query({ query, fetchPolicy: "network-only" }));
  assert.equal(getSession(), token);
  client.stop();
});
