import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type SupportNoticeProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  children?: ReactNode;
  tone?: "default" | "warning";
  className?: string;
};

export function SupportNotice({
  title,
  description,
  icon: Icon,
  children,
  tone = "default",
  className,
}: SupportNoticeProps) {
  return (
    <Card
      className={cn(
        "rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card",
        tone === "warning" && "border-wv-warning/40 bg-[#fffaf0]",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md bg-wv-background text-wv-primary",
              tone === "warning" && "bg-white text-wv-warning"
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-wv-text">{title}</h3>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
                {description}
              </p>
            ) : null}
            {children ? <div className="mt-4">{children}</div> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
