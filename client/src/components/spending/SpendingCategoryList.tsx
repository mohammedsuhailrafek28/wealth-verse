import { Progress } from "@/components/ui/progress";
import { formatCurrencyINR, formatTitle } from "@/lib/formatters";
import type { SpendingCategoryDatum } from "./SpendingBreakdownChart";

export type SpendingCategoryListProps = {
  categories: SpendingCategoryDatum[];
};

export function SpendingCategoryList({ categories }: SpendingCategoryListProps) {
  return (
    <div className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card">
      <h2 className="text-lg font-bold text-wv-text">Ranked categories</h2>
      <div className="mt-5 space-y-5">
        {categories.map((category, index) => (
          <div key={category.name}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-sm font-bold text-wv-text">
                  {index + 1}. {formatTitle(category.name)}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-wv-text">
                  {formatCurrencyINR(category.amount)}
                </p>
                <p className="text-xs text-wv-muted">
                  {category.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <Progress
              value={category.percentage}
              className="mt-2 h-2 bg-wv-border"
              aria-label={`${formatTitle(category.name)} is ${category.percentage.toFixed(1)} percent of spending`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
