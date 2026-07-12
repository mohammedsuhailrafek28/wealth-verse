import { Button } from "@/components/ui/button";
import { formatCurrencyINR, formatPercentage, formatTitle } from "@/lib/formatters";
import { Target } from "lucide-react";

export type GoalFocusPanelProps = {
  goalName?: string;
  priority?: string;
  remainingAmount?: number;
  progress?: number;
  timelineMonths?: number;
  reason: string;
  actionHref?: string;
};

export function GoalFocusPanel({
  goalName,
  priority,
  remainingAmount,
  progress,
  timelineMonths,
  reason,
  actionHref = "/recommendations",
}: GoalFocusPanelProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-wv-background text-wv-primary">
            <Target className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
              Goal planning insight
            </p>
            <h2 className="mt-2 text-xl font-bold text-wv-text">
              {goalName ? formatTitle(goalName) : "Review goals once data is available"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-wv-text-secondary">
              {reason}
            </p>
          </div>
        </div>

        {goalName ? (
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-96">
            <FocusMetric label="Priority" value={formatTitle(priority)} />
            <FocusMetric
              label="Remaining"
              value={formatCurrencyINR(Math.max(remainingAmount ?? 0, 0))}
            />
            <FocusMetric
              label="Progress"
              value={formatPercentage(Math.min(100, Math.max(progress ?? 0, 0)))}
            />
            {typeof timelineMonths === "number" ? (
              <p className="sm:col-span-2 text-xs leading-5 text-wv-muted">
                Timeline field: {timelineMonths} months. This is not a completion forecast.
              </p>
            ) : null}
            <Button
              asChild
              variant="outline"
              className="min-h-11 border-wv-border text-wv-text"
            >
              <a href={actionHref}>Review recommendations</a>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FocusMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--wv-radius-form)] bg-wv-background p-3">
      <p className="text-xs font-semibold text-wv-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-wv-text">{value}</p>
    </div>
  );
}
