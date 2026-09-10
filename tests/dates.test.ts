import test from "node:test";
import assert from "node:assert/strict";
import { formatDate, newestFirst } from "../src/lib/dates";
import { getProjects } from "../src/lib/dashboard";

test("dates sort chronologically across timezone offsets with invalid values last", () => {
  const dates = ["invalid", "2026-05-03T00:15:00+04:00", "2026-05-02T23:00:00Z", null];
  assert.deepEqual(dates.sort(newestFirst), [
    "2026-05-02T23:00:00Z",
    "2026-05-03T00:15:00+04:00",
    "invalid",
    null,
  ]);
  assert.equal(formatDate("bad"), "—");
  assert.equal(formatDate("2026-05-03T00:15:00+04:00"), "02 May 2026");
});

test("latest project awards use the actual instant rather than the timestamp text", () => {
  const projects = getProjects({
    progress: [],
    transactions: [
      {
        amount: 100,
        createdAt: "2026-05-03T00:15:00+04:00",
        object: { type: "project", name: "forum" },
      },
      {
        amount: 200,
        createdAt: "2026-05-02T23:00:00Z",
        object: { type: "project", name: "forum" },
      },
    ],
  });
  assert.equal(projects[0].date, "2026-05-02T23:00:00Z");
});
