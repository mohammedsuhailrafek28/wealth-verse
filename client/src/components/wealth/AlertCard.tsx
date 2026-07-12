import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatTitle } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

export type AlertCardProps = {
  title: string;
  message: string;
  severity: string;
  isRead?: boolean;
  createdAt?: string | Date | null;
  className?: string;
};

export function AlertCard({
  title,
  message,
  severity,
  isRead = false,
  createdAt,
  className,
}: AlertCardProps) {
  const isHigh = severity === "high";
  const Icon = isHigh ? AlertTriangle : Info;

  return (
    <Card
      className={cn(
        "rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card",
        isHigh && "border-wv-error/30",
        className
      )}
    >
      <CardContent className="flex gap-4 p-5">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md bg-wv-background text-wv-primary",
            isHigh && "bg-wv-error/10 text-wv-error"
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-wv-text">{title}</h3>
            <span className="rounded-full bg-wv-background px-2 py-0.5 text-xs font-semibold text-wv-text-secondary">
              {formatTitle(severity)}
            </span>
            {!isRead ? (
              <span className="rounded-full bg-wv-primary/10 px-2 py-0.5 text-xs font-semibold text-wv-primary">
                Unread
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-wv-text-secondary">{message}</p>
          {createdAt ? (
            <p className="mt-2 text-xs text-wv-muted">{formatDate(createdAt)}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
