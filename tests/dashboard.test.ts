import test from "node:test";
import assert from "node:assert/strict";
import {
  amountOf,
  formatXP,
  getAudits,
  getProjects,
  getRank,
  getSkills,
  getTimeline,
  userAttrs,
  type Transaction,
} from "../src/lib/dashboard";
import { demoData, DEMO_DATE } from "../src/lib/demo-data";

test("rank boundaries include the final milestone and levels above it", () => {
  assert.equal(getRank(0).current.name, "Aspiring Developer");
  assert.equal(getRank(40).current.name, "Basic Developer");
  assert.equal(getRank(42).percentage, 20);
  assert.equal(getRank(42).remaining, 8);
  assert.equal(getRank(60).current.name, "Full-Stack Developer");
  assert.equal(getRank(80).next, null);
  assert.equal(getRank(80).percentage, 100);
  assert.equal(getRank(-5).percentage, 0);
  assert.equal(getRank(NaN).current.level, 0);
});

test("skill percentages use maxima and exclude unrelated transactions", () => {
  assert.deepEqual(
    getSkills([
      { type: "skill_go", amount: 25 },
      { type: "skill_go", amount: 70 },
      { type: "skill_go", amount: 40 },
      { type: "xp", amount: 4000 },
      { type: "skill_js", amount: 150 },
      { type: "skill_rust", amount: -5 },
    ]),
    [
      { name: "js", value: 100 },
      { name: "go", value: 70 },
      { name: "rust", value: 0 },
    ],
  );
  assert.deepEqual(getSkills([{ type: "skill_css", amount: NaN }]), []);
});

test("byte formatting remains valid for empty, exact-unit, and nonfinite amounts", () => {
  assert.equal(formatXP(0), "0 B");
  assert.equal(formatXP(999), "999 B");
  assert.equal(formatXP(1000), "1.0 kB");
  assert.equal(formatXP(1000000), "1.0 MB");
  assert.equal(formatXP(NaN), "0 B");
  assert.equal(amountOf(undefined), 0);
  assert.equal(amountOf({ aggregate: { sum: null } }), 0);
  assert.equal(amountOf({ aggregate: { sum: { amount: Infinity } } }), 0);
  assert.equal(amountOf({ aggregate: { sum: { amount: -50 } } }), -50);
});

test("timeline carries prior XP into the selected period and fills empty months", () => {
  const tx = (amount: number, date: string): Transaction => ({
    amount,
    createdAt: date,
    object: null,
  });
  const result = getTimeline(
    [
      tx(100, "2026-01-10"),
      tx(50, "2026-04-12"),
      tx(25, "2026-06-30"),
      tx(900, "invalid"),
      tx(1000, "2027-01-01"),
    ],
    "3m",
    new Date("2026-06-30T23:59:59Z"),
  );
  assert.equal(result.length, 3);
  assert.deepEqual(
    result.map((point) => point.earned),
    [50, 0, 25],
  );
  assert.deepEqual(
    result.map((point) => point.total),
    [150, 150, 175],
  );
  assert.equal(result[0].month, "2026-04-01T00:00:00.000Z");
});

test("timeline handles year boundaries, unsorted awards, and empty results", () => {
  const transactions: Transaction[] = [
    { amount: 30, createdAt: "2026-01-02", object: null },
    { amount: 10, createdAt: "2025-11-01", object: null },
  ];
  const timeline = getTimeline(transactions, "all", new Date("2026-01-31"));
  assert.deepEqual(
    timeline.map((point) => point.total),
    [10, 10, 40],
  );
  assert.deepEqual(getTimeline([], "all", new Date()), []);
});

test("projects combine multiple awards and grades without counting exercise XP", () => {
  const results = getProjects({
    transactions: [
      { amount: 1000, createdAt: "2026-05-02", object: { name: "graphql", type: "project" } },
      { amount: 500, createdAt: "2026-05-03", object: { name: "graphql", type: "project" } },
      { amount: 700, createdAt: "2026-05-03", object: { name: "practice", type: "exercise" } },
    ],
    progress: [
      { object: { name: "graphql" }, grade: 0.5 },
      { object: { name: "graphql" }, grade: 1.1 },
      { object: { name: "forum" }, grade: null },
      { object: { name: "net-cat" }, grade: 0.7 },
      { object: null, grade: 1 },
    ],
  });
  assert.equal(results.length, 3);
  assert.deepEqual(results[0], {
    name: "graphql",
    xp: 1500,
    date: "2026-05-03",
    grade: 1.1,
    status: "Passed",
  });
  assert.equal(results.find((project) => project.name === "forum")?.status, "In progress");
  assert.equal(results.find((project) => project.name === "net-cat")?.status, "Retry");
});

test("projects without progress need positive net XP to count as passed", () => {
  const results = getProjects({
    transactions: [
      { amount: 0, createdAt: "2026-05-02", object: { name: "zero", type: "project" } },
      { amount: NaN, createdAt: "2026-05-02", object: { name: "invalid", type: "project" } },
      { amount: 100, createdAt: "2026-05-02", object: { name: "reversed", type: "project" } },
      { amount: -100, createdAt: "2026-05-03", object: { name: "reversed", type: "project" } },
      { amount: 10, createdAt: "2026-05-02", object: { name: "earned", type: "project" } },
    ],
    progress: [],
  });
  assert.deepEqual(
    results.filter((project) => project.status === "Passed").map((project) => project.name),
    ["earned"],
  );
  assert.equal(results.find((project) => project.name === "reversed")?.xp, 0);
});

test("profile attributes tolerate stringified, absent, and malformed values", () => {
  const user = demoData.user[0];
  assert.deepEqual(userAttrs({ ...user, attrs: '{"firstName":"Alex"}' }), { firstName: "Alex" });
  assert.deepEqual(userAttrs({ ...user, attrs: "not-json" }), {});
  assert.deepEqual(userAttrs({ ...user, attrs: "[]" }), {});
  assert.deepEqual(userAttrs({ ...user, attrs: null }), {});
});

test("audit history removes missing groups and preserves pass/fail distinctions", () => {
  const rows = getAudits({
    ...demoData.user[0],
    validAudits: {
      nodes: [{ group: null }, { group: { captainLogin: "one", createdAt: "2026-04-01" } }],
    },
    failedAudits: { nodes: [{ group: { captainLogin: "two", createdAt: "2026-05-01" } }] },
  });
  assert.deepEqual(
    rows.map((row) => row.status),
    ["Failed", "Passed"],
  );
});

test("sample totals reconcile across cards, timeline, and project rows", () => {
  const total = amountOf(demoData.moduleXP);
  const points = getTimeline(demoData.transactions, "all", new Date(DEMO_DATE));
  assert.equal(points.at(-1)?.total, total);
  assert.equal(amountOf(demoData.projectXP) + amountOf(demoData.exerciseXP), total);
  assert.equal(
    getProjects(demoData).reduce((sum, project) => sum + project.xp, 0),
    amountOf(demoData.projectXP),
  );
  assert.equal(getProjects(demoData).filter((project) => project.status === "Passed").length, 12);
  assert.equal(getAudits(demoData.user[0]).length, 24);
});
