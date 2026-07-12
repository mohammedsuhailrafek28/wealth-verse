export function formatCurrencyINR(value: number | null | undefined): string {
  if (!Number.isFinite(value)) return "₹0";
  return `₹${Math.round(value ?? 0).toLocaleString("en-IN")}`;
}

export function formatCompactCurrencyINR(value: number | null | undefined): string {
  const safeValue = Number.isFinite(value) ? Math.round(value ?? 0) : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeValue);
}

export function formatPercentage(value: number | null | undefined): string {
  if (!Number.isFinite(value)) return "0%";
  return `${Number(value).toFixed(1)}%`;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "Date unavailable";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTitle(value: string | null | undefined): string {
  if (!value) return "Not specified";
  return value
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeFinancialText(value: string): string {
  return value.replaceAll("\u00e2\u201a\u00b9", "₹").replaceAll("\u00c2\u00b7", "·");
}
