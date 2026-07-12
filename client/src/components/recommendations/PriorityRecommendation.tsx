import { Button } from "@/components/ui/button";
import { formatPercentage, formatTitle } from "@/lib/formatters";
import { Lightbulb } from "lucide-react";

export type PriorityRecommendationProps = {
  title?: string;
  expectedBenefit?: string;
  category?: string;
  riskLevel?: string;
  confidenceScore?: number;
  reason: string;
};

export function PriorityRecommendation({
  title,
  expectedBenefit,
  category,
  riskLevel,
  confidenceScore,
  reason,
}: PriorityRecommendationProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-wv-background text-wv-primary">
            <Lightbulb className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
              Priority guidance
            </p>
            <h2 className="mt-2 text-xl font-bold text-wv-text">
              {title ?? "No priority recommendation yet"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-wv-text-secondary">
              {expectedBenefit ?? reason}
            </p>
          </div>
        </div>

        {title ? (
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-96">
            <PriorityMetric label="Category" value={formatTitle(category)} />
            <PriorityMetric label="Risk" value={formatTitle(riskLevel)} />
            <PriorityMetric
              label="Confidence"
              value={formatPercentage(clampConfidence(confidenceScore))}
            />
            <p className="sm:col-span-2 text-xs leading-5 text-wv-muted">
              {reason}
            </p>
            <Button
              asChild
              variant="outline"
              className="min-h-11 border-wv-border text-wv-text"
            >
              <a href="/avatar">Ask the advisor</a>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PriorityMetric({
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

function clampConfidence(value: number | null | undefined) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Number(value)));
}
