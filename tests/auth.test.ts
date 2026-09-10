import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  clearSession,
  encodeCredentials,
  getSession,
  isValidSession,
  saveSession,
  signIn,
  AUTH_ENDPOINT,
} from "../src/lib/auth";

const originalFetch = globalThis.fetch;
const token = (exp: number) =>
  `e30.${Buffer.from(JSON.stringify({ exp })).toString("base64url")}.signature`;
function mockStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
function installStorage() {
  Object.defineProperty(globalThis, "window", { value: {}, configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: mockStorage(), configurable: true });
  Object.defineProperty(globalThis, "localStorage", { value: mockStorage(), configurable: true });
}
afterEach(() => {
  globalThis.fetch = originalFetch;
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "sessionStorage");
  Reflect.deleteProperty(globalThis, "localStorage");
});

test("expired, malformed, and missing-expiry tokens fail the client session check", () => {
  const now = 100000;
  assert.equal(isValidSession(token(101), now), true);
  assert.equal(isValidSession(token(100), now), false);
  assert.equal(isValidSession("e30.e30.sig", now), false);
  assert.equal(isValidSession("invalid", now), false);
  assert.equal(isValidSession(null, now), false);
});

test("credentials preserve UTF-8 characters and password whitespace", () => {
  assert.equal(
    Buffer.from(encodeCredentials("علي", " páss "), "base64").toString("utf8"),
    "علي: páss ",
  );
});

test("session storage replaces the legacy token and is cleared on sign-out", () => {
  installStorage();
  localStorage.setItem("authToken", "legacy");
  const value = token(Math.floor(Date.now() / 1000) + 3600);
  saveSession(value);
  assert.equal(localStorage.getItem("authToken"), null);
  assert.equal(getSession(), value);
  clearSession();
  assert.equal(getSession(), null);
});

test("expired stored sessions are discarded", () => {
  installStorage();
  sessionStorage.setItem("graphite.session", token(1));
  assert.equal(getSession(), null);
  assert.equal(sessionStorage.getItem("graphite.session"), null);
});

test("blocked legacy storage does not invalidate a newly saved session", () => {
  installStorage();
  Object.defineProperty(globalThis, "localStorage", {
    get() {
      throw new Error("blocked");
    },
    configurable: true,
  });
  const value = token(Math.floor(Date.now() / 1000) + 3600);
  saveSession(value);
  assert.equal(getSession(), value);
  clearSession();
  assert.equal(getSession(), null);
});

test("blocked session storage gives an actionable error", () => {
  installStorage();
  Object.defineProperty(globalThis, "sessionStorage", {
    get() {
      throw new Error("blocked");
    },
    configurable: true,
  });
  assert.throws(
    () => saveSession(token(Math.floor(Date.now() / 1000) + 3600)),
    /blocking session storage/,
  );
});

test("server rendering has no session and rejected storage is handled", () => {
  assert.equal(getSession(), null);
  Object.defineProperty(globalThis, "window", { value: {}, configurable: true });
  Object.defineProperty(globalThis, "sessionStorage", {
    get: () => {
      throw new Error("blocked");
    },
    configurable: true,
  });
  assert.equal(getSession(), null);
});

test("sign-in calls only the configured endpoint and saves a valid session", async () => {
  installStorage();
  const value = token(Math.floor(Date.now() / 1000) + 3600);
  globalThis.fetch = async (input, init) => {
    assert.equal(input, AUTH_ENDPOINT);
    assert.equal(init?.method, "POST");
    assert.equal(init?.cache, "no-store");
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("authorization"), `Basic ${encodeCredentials("alex", "secret")}`);
    return new Response(JSON.stringify(value), { status: 200 });
  };
  await signIn(" alex ", "secret");
  assert.equal(getSession(), value);
});

test("failed logins and invalid successful responses never create sessions", async () => {
  installStorage();
  globalThis.fetch = async () => new Response("denied", { status: 401 });
  await assert.rejects(signIn("alex", "wrong"), /isn’t correct/);
  assert.equal(getSession(), null);
  globalThis.fetch = async () => new Response('"not-a-token"', { status: 200 });
  await assert.rejects(signIn("alex", "wrong"), /invalid session/);
  assert.equal(getSession(), null);
});

test("rate limits, outages, and network failures remain failures", async () => {
  globalThis.fetch = async () => new Response(null, { status: 429 });
  await assert.rejects(signIn("alex", "secret"), /Too many attempts/);
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await assert.rejects(signIn("alex", "secret"), /unavailable/);
  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  await assert.rejects(signIn("alex", "secret"), /offline/);
});
