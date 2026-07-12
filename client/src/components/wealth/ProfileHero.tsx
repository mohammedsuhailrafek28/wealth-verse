import { Button } from "@/components/ui/button";
import { formatTitle } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export type ProfileHeroProps = {
  profileName: string;
  occupation?: string | null;
  riskProfile?: string | null;
  summary: string;
  insight?: string;
  onAskAdvisor?: () => void;
  className?: string;
};

export function ProfileHero({
  profileName,
  occupation,
  riskProfile,
  summary,
  insight,
  onAskAdvisor,
  className,
}: ProfileHeroProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card sm:p-6",
        className
      )}
      aria-labelledby="dashboard-title"
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
            Wealth command centre
          </p>
          <h1
            id="dashboard-title"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-wv-text sm:text-3xl"
          >
            Welcome back, {profileName}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-wv-text-secondary sm:text-base">
            {summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {occupation ? <HeroPill label={formatTitle(occupation)} /> : null}
            {riskProfile ? <HeroPill label={`${formatTitle(riskProfile)} risk profile`} /> : null}
          </div>
        </div>
        <div className="rounded-[var(--wv-radius-form)] border border-wv-border bg-wv-background p-4 lg:max-w-sm">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-wv-primary text-white">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-wv-text">Next best signal</h2>
              <p className="mt-1 text-sm leading-6 text-wv-text-secondary">
                {insight ?? "Review your dashboard sections for the latest profile signals."}
              </p>
              {onAskAdvisor ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 min-h-10 border-wv-border text-wv-text hover:bg-wv-surface"
                  onClick={onAskAdvisor}
                >
                  Ask advisor
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-semibold text-wv-text-secondary">
      {label}
    </span>
  );
}
