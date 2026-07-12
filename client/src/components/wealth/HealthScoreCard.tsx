import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type HealthScoreBreakdown = {
  label: string;
  score: number;
  description?: string;
};

export type HealthScoreCardProps = {
  score: number;
  category: string;
  description: string;
  breakdown: HealthScoreBreakdown[];
  projection?: string;
  className?: string;
};

export function HealthScoreCard({
  score,
  category,
  description,
  breakdown,
  projection,
  className,
}: HealthScoreCardProps) {
  const safeScore = clampScore(score);

  return (
    <Card
      className={cn(
        "rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
              Financial health
            </p>
            <div
              className="mx-auto mt-5 flex size-36 items-center justify-center rounded-full border-[14px] border-wv-primary/20 bg-wv-background lg:mx-0"
              aria-label={`Financial health score ${safeScore} out of 100`}
            >
              <div>
                <p className="text-4xl font-bold tracking-tight text-wv-text">
                  {safeScore}
                </p>
                <p className="text-xs font-semibold text-wv-muted">out of 100</p>
              </div>
            </div>
            <p className="mt-4 text-lg font-bold capitalize text-wv-text">
              {category}
            </p>
            <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
              {description}
            </p>
            {projection ? (
              <p className="mt-3 rounded-md bg-wv-background px-3 py-2 text-xs font-semibold text-wv-primary">
                {projection}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {breakdown.map((item) => {
              const itemScore = clampScore(item.score);
              return (
                <div
                  key={item.label}
                  className="rounded-[var(--wv-radius-form)] border border-wv-border bg-wv-background p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-wv-text">{item.label}</h3>
                    <span className="text-sm font-bold text-wv-primary">
                      {itemScore}/100
                    </span>
                  </div>
                  <Progress
                    value={itemScore}
                    className="mt-3 h-2 bg-wv-border"
                    aria-label={`${item.label} score ${itemScore} out of 100`}
                  />
                  {item.description ? (
                    <p className="mt-2 text-xs leading-5 text-wv-text-secondary">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
