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
  className?: string;
};

export function GoalCard({
  title,
  currentAmount,
  targetAmount,
  priority,
  monthlyContribution,
  className,
}: GoalCardProps) {
  const progress =
    targetAmount > 0 ? Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100)) : 0;

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
          <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-bold text-wv-primary">
            {formatTitle(priority)}
          </span>
        </div>
        <Progress
          value={progress}
          className="mt-4 h-2 bg-wv-border"
          aria-label={`${formatTitle(title)} goal progress ${Math.round(progress)} percent`}
        />
        <div className="mt-3 flex items-center justify-between text-xs text-wv-muted">
          <span>{Math.round(progress)}% complete</span>
          {typeof monthlyContribution === "number" ? (
            <span>{formatCurrencyINR(monthlyContribution)}/month suggested</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
