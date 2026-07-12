import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTitle } from "@/lib/formatters";

export type RecommendationCardProps = {
  title: string;
  category: string;
  expectedBenefit: string;
  riskLevel: string;
  confidenceScore?: number;
  reasons?: string[];
  className?: string;
};

export function RecommendationCard({
  title,
  category,
  expectedBenefit,
  riskLevel,
  confidenceScore,
  reasons = [],
  className,
}: RecommendationCardProps) {
  return (
    <Card className={cn("rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card", className)}>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-bold text-wv-primary">
            {formatTitle(category)}
          </span>
          <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-semibold text-wv-text-secondary">
            {formatTitle(riskLevel)} risk
          </span>
          {typeof confidenceScore === "number" ? (
            <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-semibold text-wv-text-secondary">
              {Math.round(confidenceScore)}% confidence
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-base font-bold leading-6 text-wv-text">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
          {expectedBenefit}
        </p>
        {reasons.length > 0 ? (
          <ul className="mt-4 space-y-2 text-xs leading-5 text-wv-muted">
            {reasons.slice(0, 2).map((reason) => (
              <li key={reason}>Reason: {reason}</li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
