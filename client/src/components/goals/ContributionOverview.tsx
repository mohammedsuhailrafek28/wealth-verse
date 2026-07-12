import { formatCurrencyINR, formatTitle } from "@/lib/formatters";

export type ContributionItem = {
  id: number;
  name: string;
  priority: string;
  monthlyContribution: number;
};

export type ContributionOverviewProps = {
  totalMonthlyContribution: number;
  items: ContributionItem[];
};

export function ContributionOverview({
  totalMonthlyContribution,
  items,
}: ContributionOverviewProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
            Contribution overview
          </p>
          <h2 className="mt-2 text-xl font-bold text-wv-text">
            Combined planned contribution
          </h2>
          <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
            Monthly contribution values are returned by the current goal endpoint.
          </p>
        </div>
        <div className="rounded-[var(--wv-radius-form)] bg-wv-background p-4 text-right">
          <p className="text-xs font-semibold text-wv-muted">Total per month</p>
          <p className="mt-1 text-2xl font-bold text-wv-text">
            {formatCurrencyINR(totalMonthlyContribution)}
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-wv-border">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-wv-text">
                  {formatTitle(item.name)}
                </p>
                <p className="mt-1 text-xs text-wv-muted">
                  Priority: {formatTitle(item.priority)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-wv-primary">
                {formatCurrencyINR(item.monthlyContribution)}
              </p>
            </div>
          ))
        ) : (
          <p className="py-3 text-sm text-wv-text-secondary">
            No monthly contribution data is available for this profile.
          </p>
        )}
      </div>
    </section>
  );
}
