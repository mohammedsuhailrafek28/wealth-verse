import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BriefcaseBusiness, Check, Rocket, UsersRound, WalletCards } from "lucide-react";
import type { ComponentType } from "react";

type PersonaIcon = "briefcase" | "family" | "young" | "entrepreneur";

const iconMap: Record<PersonaIcon, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  briefcase: WalletCards,
  family: UsersRound,
  young: BriefcaseBusiness,
  entrepreneur: Rocket,
};

export type PersonaCardProps = {
  id: number;
  title: string;
  description: string;
  occupation?: string | null;
  riskProfile?: string | null;
  icon: PersonaIcon;
  selected: boolean;
  disabled?: boolean;
  onSelect: (id: number) => void;
  onContinue: (id: number) => void;
};

export function PersonaCard({
  id,
  title,
  description,
  occupation,
  riskProfile,
  icon,
  selected,
  disabled = false,
  onSelect,
  onContinue,
}: PersonaCardProps) {
  const Icon = iconMap[icon];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[22px] border bg-white p-5 text-left shadow-[0_24px_70px_-40px_rgba(12,133,119,0.38)] transition-all",
        selected
          ? "border-wv-primary ring-2 ring-wv-primary/22"
          : "border-wv-border hover:-translate-y-1 hover:border-wv-primary/40 hover:shadow-[0_28px_80px_-42px_rgba(12,133,119,0.5)]",
        disabled && "pointer-events-none opacity-70"
      )}
    >
      <button
        type="button"
        className="absolute inset-0 rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-primary focus-visible:ring-offset-4"
        onClick={() => onSelect(id)}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={`Select ${title}`}
      />

      <div className="relative flex flex-1 flex-col">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl",
            selected ? "bg-wv-primary text-white" : "bg-wv-background text-wv-primary"
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>

        <div className="mt-7 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-wv-text">{title}</h2>
            <p className="mt-2 min-h-16 text-sm leading-6 text-wv-text-secondary">
              {description}
            </p>
          </div>
          {selected ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-wv-primary text-white">
              <Check className="size-4" aria-hidden />
            </span>
          ) : null}
        </div>

        <dl className="mt-5 grid gap-2 text-xs text-wv-muted">
          {occupation ? (
            <div className="flex items-center justify-between gap-3">
              <dt>Occupation</dt>
              <dd className="font-semibold text-wv-text-secondary">{occupation}</dd>
            </div>
          ) : null}
          {riskProfile ? (
            <div className="flex items-center justify-between gap-3">
              <dt>Risk style</dt>
              <dd className="font-semibold text-wv-text-secondary">{riskProfile}</dd>
            </div>
          ) : null}
        </dl>

        <Button
          type="button"
          className={cn(
            "relative z-10 mt-7 min-h-11 w-full rounded-full",
            selected
              ? "bg-wv-primary text-white hover:bg-wv-primary-dark"
              : "border-wv-border bg-white text-wv-primary hover:bg-wv-background"
          )}
          variant={selected ? "default" : "outline"}
          onClick={() => onContinue(id)}
          disabled={disabled}
        >
          Continue
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </article>
  );
}
