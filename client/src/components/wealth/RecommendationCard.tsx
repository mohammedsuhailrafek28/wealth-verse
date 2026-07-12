import { Card, CardContent } from "@/components/ui/card";
import { RecommendationExplainability } from "@/components/recommendations/RecommendationExplainability";
import { cn } from "@/lib/utils";
import { formatTitle } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export type RecommendationCardProps = {
  title: string;
  category: string;
  expectedBenefit: string;
  riskLevel: string;
  confidenceScore?: number;
  reasons?: string[];
  nextStep?: string;
  showExplainability?: boolean;
  advisorHref?: string;
  className?: string;
};

export function RecommendationCard({
  title,
  category,
  expectedBenefit,
  riskLevel,
  confidenceScore,
  reasons = [],
  nextStep,
  showExplainability = false,
  advisorHref,
  className,
}: RecommendationCardProps) {
  const confidence = clampConfidence(confidenceScore);

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
              {Math.round(confidence)}% confidence
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-base font-bold leading-6 text-wv-text">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
          {expectedBenefit}
        </p>
        {!showExplainability && reasons.length > 0 ? (
          <ul className="mt-4 space-y-2 text-xs leading-5 text-wv-muted">
            {reasons.slice(0, 2).map((reason) => (
              <li key={reason}>Reason: {reason}</li>
            ))}
          </ul>
        ) : null}
        {nextStep ? (
          <div className="mt-4 rounded-[var(--wv-radius-form)] bg-wv-background p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-wv-primary">
              Educational next step
            </p>
            <p className="mt-2 text-sm leading-6 text-wv-text-secondary">{nextStep}</p>
          </div>
        ) : null}
        {showExplainability ? (
          <RecommendationExplainability
            reasons={reasons}
            confidenceScore={confidence}
            riskLevel={formatTitle(riskLevel)}
          />
        ) : null}
        {advisorHref ? (
          <Button
            asChild
            variant="outline"
            className="mt-5 min-h-11 border-wv-border text-wv-text"
          >
            <a href={advisorHref}>Ask the advisor</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function clampConfidence(value: number | null | undefined) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Number(value)));
}
