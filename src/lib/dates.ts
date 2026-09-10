export function timestamp(value: string | null | undefined): number {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : -Infinity;
}

/** Compare instants, not ISO text: timezone offsets can reverse lexical order. */
export function newestFirst(left: string | null | undefined, right: string | null | undefined) {
  const a = timestamp(left);
  const b = timestamp(right);
  return a === b ? 0 : a > b ? -1 : 1;
}

export function formatDate(value: string | null | undefined) {
  const instant = timestamp(value);
  return Number.isFinite(instant)
    ? new Date(instant).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—";
}
