import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyINR, formatTitle, normalizeFinancialText } from "@/lib/formatters";
import { PiggyBank } from "lucide-react";

export type SavingsOpportunityCardProps = {
  category: string;
  amount: number;
  suggestion: string;
  priority: "high" | "medium" | "low";
};

export function SavingsOpportunityCard({
  category,
  amount,
  suggestion,
  priority,
}: SavingsOpportunityCardProps) {
  return (
    <Card className="rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-wv-primary/10 text-wv-primary">
              <PiggyBank className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-wv-text">{formatTitle(category)}</h3>
              <p className="mt-1 text-xs text-wv-muted">Potential monthly adjustment</p>
            </div>
          </div>
          <span className="rounded-full bg-wv-background px-3 py-1 text-xs font-bold text-wv-primary">
            {formatTitle(priority)}
          </span>
        </div>
        <p className="mt-4 text-2xl font-bold text-wv-text">
          {formatCurrencyINR(amount)}
        </p>
        <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
          {normalizeFinancialText(suggestion)}
        </p>
      </CardContent>
    </Card>
  );
}
