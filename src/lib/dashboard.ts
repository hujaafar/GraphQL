export type Transaction = { amount: number; createdAt: string; object: { name: string; type: string } | null };
export type Aggregate = { aggregate: { sum: { amount: number | null } | null } | null };
export type AuditNode = { group: { captainLogin: string; createdAt: string } | null };
export type Learner = { id: number; login: string; email: string; attrs: Record<string, unknown> | string | null; auditRatio: number | null; totalUp: number; totalDown: number; validAudits: { nodes: AuditNode[] }; failedAudits: { nodes: AuditNode[] } };
export type DashboardData = {
  user: Learner[];
  moduleXP: Aggregate; projectXP: Aggregate; exerciseXP: Aggregate; piscineGoXP: Aggregate; piscineJsXP: Aggregate;
  currentLevel: { amount: number }[];
  transactions: Transaction[];
  skillTransactions: { type: string; amount: number }[];
  progress: { grade: number | null; object: { name: string } | null }[];
};
export type Period = "all" | "6m" | "3m";
export type Project = { name: string; xp: number; date: string | null; grade: number | null; status: "Passed" | "In progress" | "Retry" };

export const ranks = [
  { name: "Aspiring Developer", level: 0 }, { name: "Beginner Developer", level: 10 },
  { name: "Apprentice Developer", level: 20 }, { name: "Assistant Developer", level: 30 },
  { name: "Basic Developer", level: 40 }, { name: "Junior Developer", level: 50 },
  { name: "Confirmed Developer", level: 55 }, { name: "Full-Stack Developer", level: 60 },
];

export function getRank(level: number) {
  const safeLevel = Number.isFinite(level) ? Math.max(0, level) : 0;
  // Search from the highest milestone so level 60+ remains in the final rank.
  const current = [...ranks].reverse().find(rank => safeLevel >= rank.level) || ranks[0];
  const next = ranks.find(rank => rank.level > safeLevel) || null;
  const percentage = next ? Math.min(100, ((safeLevel - current.level) / (next.level - current.level)) * 100) : 100;
  return { current, next, percentage, remaining: next ? next.level - safeLevel : 0 };
}

export function formatXP(value: number, digits = 1) {
  const n = Number.isFinite(value) ? value : 0;
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(digits)} MB`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(digits)} kB`;
  return `${Math.round(n)} B`;
}
export const amountOf = (value: Aggregate | undefined) => value?.aggregate?.sum?.amount || 0;
export function readableName(name: string) { return name.replace(/^skill_/, "").replace(/[-_]/g, " "); }
export function userAttrs(user: Learner): Record<string, unknown> {
  if (typeof user.attrs === "string") { try { const parsed = JSON.parse(user.attrs); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}; } catch { return {}; } }
  return user.attrs && !Array.isArray(user.attrs) ? user.attrs : {};
}

export function getSkills(transactions: DashboardData["skillTransactions"]) {
  const values = new Map<string, number>();
  // Skill transactions record attained percentages, rather than additive XP awards.
  for (const transaction of transactions) {
    if (!transaction.type.startsWith("skill_") || !Number.isFinite(transaction.amount)) continue;
    values.set(transaction.type, Math.max(values.get(transaction.type) || 0, Math.min(100, Math.max(0, transaction.amount))));
  }
  return [...values].map(([type, value]) => ({ name: readableName(type), value })).sort((a, b) => b.value - a.value);
}

export function getProjects(data: Pick<DashboardData, "transactions" | "progress">): Project[] {
  const projects = new Map<string, Project>();
  for (const transaction of data.transactions) {
    if (transaction.object?.type !== "project") continue;
    const name = transaction.object.name;
    const item = projects.get(name) || { name, xp: 0, date: null, grade: null, status: "Passed" as const };
    item.xp += Number.isFinite(transaction.amount) ? transaction.amount : 0;
    if (!Number.isNaN(Date.parse(transaction.createdAt)) && (!item.date || transaction.createdAt > item.date)) item.date = transaction.createdAt;
    projects.set(name, item);
  }
  for (const progress of data.progress) {
    if (!progress.object) continue;
    const name = progress.object.name;
    const item = projects.get(name) || { name, xp: 0, date: null, grade: null, status: "In progress" as const };
    if (progress.grade !== null && Number.isFinite(progress.grade)) item.grade = Math.max(item.grade ?? -Infinity, progress.grade);
    item.status = item.xp > 0 || (item.grade !== null && item.grade >= 1) ? "Passed" : item.grade === null ? "In progress" : "Retry";
    projects.set(name, item);
  }
  return [...projects.values()].sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.name.localeCompare(b.name));
}

export function getTimeline(transactions: Transaction[], period: Period, anchor: Date) {
  const valid = transactions.filter(t => Number.isFinite(t.amount) && !Number.isNaN(Date.parse(t.createdAt)) && Date.parse(t.createdAt) <= anchor.getTime()).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  if (!valid.length) return [];
  const end = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  const earliest = new Date(valid[0].createdAt);
  const start = period === "all" ? new Date(Date.UTC(earliest.getUTCFullYear(), earliest.getUTCMonth(), 1)) : new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (period === "6m" ? 5 : 2), 1));
  let cumulative = valid.filter(t => Date.parse(t.createdAt) < start.getTime()).reduce((sum, t) => sum + t.amount, 0);
  const monthly = new Map<string, number>();
  for (const item of valid) {
    const date = new Date(item.createdAt);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    monthly.set(key, (monthly.get(key) || 0) + item.amount);
  }
  const points: { label: string; month: string; earned: number; total: number }[] = [];
  for (const month = new Date(start); month <= end; month.setUTCMonth(month.getUTCMonth() + 1)) {
    const earned = monthly.get(`${month.getUTCFullYear()}-${month.getUTCMonth()}`) || 0;
    cumulative += earned;
    points.push({ label: month.toLocaleDateString("en", { month: "short", year: "2-digit", timeZone: "UTC" }), month: month.toISOString(), earned, total: cumulative });
  }
  return points;
}

export function getAudits(user: Learner) {
  return [...(user.validAudits?.nodes || []).map(node => ({ ...node, status: "Passed" as const })), ...(user.failedAudits?.nodes || []).map(node => ({ ...node, status: "Failed" as const }))]
    .filter(node => node.group).sort((a, b) => (b.group?.createdAt || "").localeCompare(a.group?.createdAt || ""));
}
