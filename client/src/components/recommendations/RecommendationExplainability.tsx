import { Progress } from "@/components/ui/progress";
import { formatPercentage } from "@/lib/formatters";

export type RecommendationExplainabilityProps = {
  reasons?: string[];
  confidenceScore?: number;
  riskLevel: string;
};

export function RecommendationExplainability({
  reasons = [],
  confidenceScore,
  riskLevel,
}: RecommendationExplainabilityProps) {
  const confidence = clampConfidence(confidenceScore);

  return (
    <details className="mt-5 rounded-[var(--wv-radius-form)] border border-wv-border bg-wv-background p-4">
      <summary className="cursor-pointer text-sm font-bold text-wv-text outline-none focus-visible:ring-2 focus-visible:ring-wv-primary focus-visible:ring-offset-2">
        Why this was suggested
      </summary>
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="font-semibold text-wv-text">Confidence</p>
            <p className="font-bold text-wv-primary">{formatPercentage(confidence)}</p>
          </div>
          <Progress
            value={confidence}
            className="mt-2 h-2 bg-wv-border"
            aria-label={`Recommendation confidence ${Math.round(confidence)} percent`}
          />
          <p className="mt-2 text-xs leading-5 text-wv-muted">
            Confidence reflects how strongly the current profile matches this
            deterministic recommendation rule. It is not a probability of success.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-wv-text">Risk context</p>
          <p className="mt-1 text-sm leading-6 text-wv-text-secondary">
            Risk level: {riskLevel}. This describes the recommendation context,
            not account compromise or guaranteed loss.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-wv-text">Reasons</p>
          {reasons.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm leading-6 text-wv-text-secondary">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="font-bold text-wv-primary" aria-hidden="true">
                    -
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
              No additional explanation is available for this recommendation.
            </p>
          )}
        </div>
      </div>
    </details>
  );
}

function clampConfidence(value: number | null | undefined) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Number(value)));
}
