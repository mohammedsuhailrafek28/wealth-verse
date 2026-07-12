import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SupportCategoryCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  active?: boolean;
  onSelect: () => void;
};

export function SupportCategoryCard({
  title,
  description,
  icon: Icon,
  active = false,
  onSelect,
}: SupportCategoryCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface py-0 shadow-wv-card",
        active && "border-wv-primary ring-2 ring-wv-primary/20"
      )}
    >
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex size-11 items-center justify-center rounded-md bg-wv-background text-wv-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-bold text-wv-text">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-wv-text-secondary">
          {description}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 min-h-11 border-wv-border text-wv-text hover:bg-wv-background"
          onClick={onSelect}
          aria-pressed={active}
        >
          View related FAQs
        </Button>
      </CardContent>
    </Card>
  );
}
