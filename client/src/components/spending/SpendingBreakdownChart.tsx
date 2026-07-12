import { formatCurrencyINR, formatTitle } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export type SpendingCategoryDatum = {
  name: string;
  amount: number;
  percentage: number;
  color: string;
};

export type SpendingBreakdownChartProps = {
  categories: SpendingCategoryDatum[];
  total: number;
  className?: string;
};

export function SpendingBreakdownChart({
  categories,
  total,
  className,
}: SpendingBreakdownChartProps) {
  const gradient = buildConicGradient(categories);
  const topCategory = categories[0];

  return (
    <div
      className={cn(
        "rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card",
        className
      )}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div
          className="relative size-44 shrink-0 rounded-full"
          style={{ background: gradient }}
          role="img"
          aria-label={`Spending distribution chart. Total expenses ${formatCurrencyINR(total)}. Largest category ${topCategory ? formatTitle(topCategory.name) : "none"}.`}
        >
          <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-wv-surface text-center shadow-wv-low">
            <span className="text-xs font-semibold text-wv-muted">Total</span>
            <span className="mt-1 text-lg font-bold text-wv-text">
              {formatCurrencyINR(total)}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-wv-text">Category distribution</h2>
          <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
            Ranked expense categories from the current profile. Percentages are
            calculated from the returned category totals.
          </p>
          {topCategory ? (
            <p className="mt-4 rounded-[var(--wv-radius-form)] bg-wv-background p-3 text-sm font-semibold text-wv-primary">
              {formatTitle(topCategory.name)} is the largest category at{" "}
              {topCategory.percentage.toFixed(1)}% of recorded expenses.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function buildConicGradient(categories: SpendingCategoryDatum[]) {
  if (categories.length === 0) return "#e2e9e7";
  let cursor = 0;
  const stops = categories.map((category) => {
    const start = cursor;
    const end = cursor + category.percentage;
    cursor = end;
    return `${category.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}
