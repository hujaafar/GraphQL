import type { DashboardData, Aggregate, Transaction } from "./dashboard";

// Deliberately fictional fixtures. Never substitute these for a failed live API request.
export const DEMO_DATE = "2026-09-09T23:59:59.000Z";
const awards = [
  ["go-reloaded", 24500, "2026-03-08"],
  ["ascii-art", 32500, "2026-03-26"],
  ["ascii-art-web", 38400, "2026-04-05"],
  ["groupie-tracker", 42500, "2026-04-22"],
  ["lem-in", 55200, "2026-05-07"],
  ["net-cat", 48000, "2026-05-28"],
  ["forum", 86000, "2026-06-16"],
  ["make-your-game", 52000, "2026-06-25"],
  ["real-time-forum", 92000, "2026-07-18"],
  ["graphql", 62500, "2026-08-02"],
  ["social-network", 104000, "2026-08-21"],
  ["mini-framework", 79000, "2026-09-08"],
] as const;
const transactions: Transaction[] = awards.map(([name, amount, date]) => ({
  amount,
  createdAt: `${date}T12:00:00.000Z`,
  object: { name, type: "project" },
}));
transactions.push({
  amount: 18000,
  createdAt: "2026-05-14T12:00:00.000Z",
  object: { name: "module-exercises", type: "exercise" },
});
const aggregate = (amount: number): Aggregate => ({ aggregate: { sum: { amount } } });
const total = transactions.reduce((sum, item) => sum + item.amount, 0);

export const demoData: DashboardData = {
  user: [
    {
      id: 101,
      login: "alex.demo",
      email: "alex@example.com",
      attrs: {
        firstName: "Alex",
        lastName: "Morgan",
        country: "Bahrain",
        addressCity: "Manama",
        qualification: "Software development",
        employment: "Student",
      },
      auditRatio: 1.34,
      totalUp: 1809000,
      totalDown: 1350000,
      validAudits: {
        nodes: Array.from({ length: 19 }, (_, index) => ({
          group: {
            captainLogin: ["sara.demo", "omar.demo", "noor.demo", "zain.demo"][index % 4],
            createdAt: new Date(Date.UTC(2026, 8, 9 - index * 3)).toISOString(),
          },
        })),
      },
      failedAudits: {
        nodes: Array.from({ length: 5 }, (_, index) => ({
          group: {
            captainLogin: ["leo.demo", "maya.demo"][index % 2],
            createdAt: new Date(Date.UTC(2026, 8, 6 - index * 8)).toISOString(),
          },
        })),
      },
    },
  ],
  moduleXP: aggregate(total),
  projectXP: aggregate(total - 18000),
  exerciseXP: aggregate(18000),
  piscineGoXP: aggregate(104800),
  piscineJsXP: aggregate(86300),
  currentLevel: [{ amount: 42 }],
  transactions,
  skillTransactions: [
    { type: "skill_go", amount: 87 },
    { type: "skill_js", amount: 79 },
    { type: "skill_html", amount: 75 },
    { type: "skill_css", amount: 72 },
    { type: "skill_sql", amount: 66 },
    { type: "skill_graphql", amount: 61 },
    { type: "skill_unix", amount: 57 },
    { type: "skill_docker", amount: 54 },
    { type: "skill_go", amount: 60 },
  ],
  progress: [
    ...awards.map(([name], index) => ({ object: { name }, grade: 1 + (index % 4) * 0.05 })),
    { object: { name: "rust-piscine" }, grade: null },
  ],
};
