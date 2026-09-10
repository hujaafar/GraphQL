import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "graphite.session";
export const AUTH_ENDPOINT =
  process.env.NEXT_PUBLIC_AUTH_URL || "https://learn.reboot01.com/api/auth/signin";
export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export function isValidSession(token: unknown, now = Date.now()): token is string {
  if (typeof token !== "string" || token.split(".").length !== 3) return false;
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    return (
      typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp * 1000 > now
    );
  } catch {
    return false;
  }
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (isValidSession(token)) return token;
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* Unavailable storage is an unsigned-in session. */
  }
  return null;
}

export function saveSession(token: unknown): void {
  if (!isValidSession(token))
    throw new Error("The server returned an invalid session. Please try signing in again.");
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    throw new Error(
      "Your browser is blocking session storage. Allow storage for this site and try again.",
    );
  }
  // Retire the previous app's persistent token; new sessions last for this tab only.
  try {
    localStorage.removeItem("authToken");
  } catch {
    /* Legacy storage can be blocked independently. */
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* Storage may be disabled. */
  }
  try {
    localStorage.removeItem("authToken");
  } catch {
    /* Always attempt both independent stores. */
  }
}

export function encodeCredentials(identifier: string, password: string): string {
  const bytes = new TextEncoder().encode(`${identifier}:${password}`);
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

export async function signIn(identifier: string, password: string): Promise<void> {
  const response = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodeCredentials(identifier.trim(), password)}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403)
      throw new Error("That username or password isn’t correct. Please try again.");
    if (response.status === 429)
      throw new Error("Too many attempts. Please wait a moment before trying again.");
    throw new Error("Reboot01 is unavailable right now. Please try again shortly.");
  }
  saveSession(await response.json());
}
