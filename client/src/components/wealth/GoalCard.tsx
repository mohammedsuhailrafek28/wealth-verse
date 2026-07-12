import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyINR, formatTitle } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export type GoalCardProps = {
  title: string;
  currentAmount: number;
  targetAmount: number;
  priority: string;
  monthlyContribution?: number;
  timelineMonths?: number;
  statusLabel?: string;
  className?: string;
};

export function GoalCard({
  title,
  currentAmount,
  targetAmount,
  priority,
  monthlyContribution,
  timelineMonths,
  statusLabel,
  className,
}: GoalCardProps) {
  const progress =
    targetAmount > 0 ? Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100)) : 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const priorityTone = getPriorityTone(priority);

  return (
    <Card className={cn("rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-wv-text">{formatTitle(title)}</h3>
            <p className="mt-1 text-sm text-wv-text-secondary">
              {formatCurrencyINR(currentAmount)} of {formatCurrencyINR(targetAmount)}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", priorityTone)}>
            {formatTitle(priority)}
          </span>
        </div>
        <Progress
          value={progress}
          className="mt-4 h-2 bg-wv-border"
          aria-label={`${formatTitle(title)} goal progress ${Math.round(progress)} percent`}
        />
        <div className="mt-3 flex items-center justify-between text-xs text-wv-muted">
          <span>{Math.round(progress)}% funded</span>
          {typeof monthlyContribution === "number" ? (
            <span>{formatCurrencyINR(monthlyContribution)}/month suggested</span>
          ) : null}
        </div>
        <div className="mt-5 grid gap-3 border-t border-wv-border pt-4 sm:grid-cols-3">
          <GoalDetail label="Remaining" value={formatCurrencyINR(remaining)} />
          <GoalDetail
            label="Timeline"
            value={typeof timelineMonths === "number" ? `${timelineMonths} months` : "Not set"}
          />
          <GoalDetail label="Status" value={statusLabel ?? getStatusLabel(progress)} />
        </div>
      </CardContent>
    </Card>
  );
}

function GoalDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-wv-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-wv-text">{value}</p>
    </div>
  );
}

function getPriorityTone(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized === "high") return "bg-wv-error/10 text-wv-error";
  if (normalized === "medium") return "bg-wv-warning/15 text-wv-text";
  return "bg-wv-background text-wv-primary";
}

function getStatusLabel(progress: number) {
  if (progress >= 90) return "Nearly complete";
  if (progress >= 60) return "Advanced";
  if (progress >= 25) return "Building";
  return "Early stage";
}
