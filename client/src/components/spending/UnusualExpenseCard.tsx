import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyINR, formatDate, formatTitle } from "@/lib/formatters";
import { AlertTriangle } from "lucide-react";

export type UnusualExpenseCardProps = {
  description: string;
  category: string;
  amount: number;
  date: string | Date;
};

export function UnusualExpenseCard({
  description,
  category,
  amount,
  date,
}: UnusualExpenseCardProps) {
  return (
    <Card className="rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card">
      <CardContent className="flex gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-wv-warning/10 text-wv-warning">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-wv-text">{description}</h3>
          <p className="mt-1 text-xs text-wv-muted">
            {formatTitle(category)} · {formatDate(date)}
          </p>
          <p className="mt-3 text-sm font-bold text-wv-text">
            {formatCurrencyINR(amount)}
          </p>
          <p className="mt-2 text-xs leading-5 text-wv-text-secondary">
            Appears here because it is significantly above this profile's typical
            expense amount.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
