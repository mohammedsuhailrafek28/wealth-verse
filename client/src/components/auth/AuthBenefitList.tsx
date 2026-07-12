import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export type AuthBenefit = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export type AuthBenefitListProps = {
  benefits: AuthBenefit[];
};

export function AuthBenefitList({ benefits }: AuthBenefitListProps) {
  return (
    <ul className="grid gap-3">
      {benefits.map((benefit) => (
        <li
          key={benefit.title}
          className="flex gap-3 rounded-[var(--wv-radius-form)] border border-white/20 bg-white/10 p-4 text-white"
        >
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-wv-accent">
            {benefit.icon ?? <CheckCircle2 className="size-4" aria-hidden="true" />}
          </span>
          <span>
            <span className="block text-sm font-bold">{benefit.title}</span>
            <span className="mt-1 block text-sm leading-6 text-white/76">
              {benefit.description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
