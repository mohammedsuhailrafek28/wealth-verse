import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SpendingInsightCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "primary" | "warning";
  className?: string;
};

export function SpendingInsightCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "primary",
  className,
}: SpendingInsightCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card",
        tone === "warning" && "border-wv-warning/40",
        className
      )}
    >
      <CardContent className="flex gap-4 p-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md bg-wv-primary/10 text-wv-primary",
            tone === "warning" && "bg-wv-warning/10 text-wv-warning"
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-wv-primary">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-bold text-wv-text">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
