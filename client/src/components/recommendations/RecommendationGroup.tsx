import { RecommendationCard } from "@/components/wealth/RecommendationCard";
import { formatTitle } from "@/lib/formatters";
import { Lightbulb } from "lucide-react";

export type RecommendationGroupItem = {
  id: string;
  title: string;
  category: string;
  expectedBenefit: string;
  riskLevel: string;
  confidenceScore: number;
  reasons: string[];
};

export type RecommendationGroupProps = {
  category: string;
  recommendations: RecommendationGroupItem[];
};

export function RecommendationGroup({
  category,
  recommendations,
}: RecommendationGroupProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-wv-background text-wv-primary">
            <Lightbulb className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-wv-text">{formatTitle(category)}</h2>
            <p className="text-sm text-wv-text-secondary">
              {recommendations.length}{" "}
              {recommendations.length === 1 ? "recommendation" : "recommendations"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            title={recommendation.title}
            category={recommendation.category}
            expectedBenefit={recommendation.expectedBenefit}
            riskLevel={recommendation.riskLevel}
            confidenceScore={recommendation.confidenceScore}
            reasons={recommendation.reasons}
            nextStep="Review the reasoning, then decide whether to discuss it with the advisor or a qualified professional."
            showExplainability
            advisorHref="/avatar"
          />
        ))}
      </div>
    </section>
  );
}
