import { Progress } from "@/components/ui/progress";

export type GoalProgressDistributionCounts = {
  early: number;
  building: number;
  advanced: number;
  nearlyComplete: number;
};

export type GoalProgressDistributionProps = {
  counts: GoalProgressDistributionCounts;
  totalGoals: number;
};

const segments = [
  {
    key: "early",
    label: "Early stage",
    range: "Below 25%",
  },
  {
    key: "building",
    label: "Building",
    range: "25% to 59%",
  },
  {
    key: "advanced",
    label: "Advanced",
    range: "60% to 89%",
  },
  {
    key: "nearlyComplete",
    label: "Nearly complete",
    range: "90%+",
  },
] as const;

export function GoalProgressDistribution({
  counts,
  totalGoals,
}: GoalProgressDistributionProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card">
      <h2 className="text-xl font-bold text-wv-text">Progress distribution</h2>
      <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
        Transparent display buckets based only on current amount divided by target amount.
      </p>
      <div className="mt-5 space-y-4">
        {segments.map((segment) => {
          const count = counts[segment.key];
          const percentage = totalGoals > 0 ? (count / totalGoals) * 100 : 0;
          return (
            <div key={segment.key}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-bold text-wv-text">{segment.label}</p>
                  <p className="text-xs text-wv-muted">{segment.range}</p>
                </div>
                <p className="font-bold text-wv-primary">
                  {count} {count === 1 ? "goal" : "goals"}
                </p>
              </div>
              <Progress
                value={percentage}
                className="mt-2 h-2 bg-wv-border"
                aria-label={`${segment.label}: ${count} of ${totalGoals} goals`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
