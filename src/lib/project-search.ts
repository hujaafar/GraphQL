import { readableName } from "./dashboard";

function normalize(value: string) {
  return readableName(value).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Search the same human-readable names that the project table displays. */
export function matchesProjectName(name: string, query: string) {
  return normalize(name).includes(normalize(query));
}
