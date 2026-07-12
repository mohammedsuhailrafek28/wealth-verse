import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { LoadingSkeleton } from "./LoadingSkeleton";

export type MetricTrendDirection = "up" | "down" | "flat";

export type FinancialMetricCardAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
};

export type FinancialMetricCardProps = {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  trendDirection?: MetricTrendDirection;
  trendAriaLabel?: string;
  action?: FinancialMetricCardAction;
  loading?: boolean;
  className?: string;
};

export function FinancialMetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendDirection = "flat",
  trendAriaLabel,
  action,
  loading = false,
  className,
}: FinancialMetricCardProps) {
  if (loading) {
    return <LoadingSkeleton variant="metric-card" className={className} />;
  }

  const TrendIcon =
    trendDirection === "up"
      ? ArrowUpRight
      : trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <article
      className={cn(
        "rounded-wv-card border border-wv-border bg-wv-surface p-5 text-wv-text shadow-wv-card",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-wv-text-secondary">{title}</h3>
          <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
        </div>
        {icon ? (
          <div className="flex size-10 items-center justify-center rounded-md bg-wv-background text-wv-primary">
            {icon}
          </div>
        ) : null}
      </div>

      {subtitle ? (
        <p className="mt-3 text-sm leading-5 text-wv-muted">{subtitle}</p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        {trend ? (
          <p
            className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold",
              trendDirection === "up" && "text-wv-success",
              trendDirection === "down" && "text-wv-error",
              trendDirection === "flat" && "text-wv-muted"
            )}
            aria-label={trendAriaLabel ?? `Trend ${trendDirection}: ${trend}`}
          >
            <TrendIcon className="size-4" aria-hidden="true" />
            <span>{trend}</span>
          </p>
        ) : (
          <span aria-hidden="true" />
        )}

        {action ? <MetricAction action={action} /> : null}
      </div>
    </article>
  );
}

function MetricAction({ action }: { action: FinancialMetricCardAction }) {
  if (action.href) {
    return (
      <Button asChild variant="ghost" size="sm" className="text-wv-primary hover:bg-wv-background">
        <a href={action.href} aria-label={action.ariaLabel}>
          {action.label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-wv-primary hover:bg-wv-background"
      onClick={action.onClick}
      aria-label={action.ariaLabel}
    >
      {action.label}
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Button>
  );
}
