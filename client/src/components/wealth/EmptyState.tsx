import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export type EmptyStateAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
};

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "rounded-wv-card border border-dashed border-wv-border bg-wv-surface p-8 text-center text-wv-text",
        className
      )}
      aria-label={title}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-wv-background text-wv-primary">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-wv-text-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5"><EmptyAction action={action} /></div> : null}
    </section>
  );
}

function EmptyAction({ action }: { action: EmptyStateAction }) {
  if (action.href) {
    return (
      <Button asChild className="bg-wv-primary text-white hover:bg-wv-primary-dark">
        <a href={action.href} aria-label={action.ariaLabel}>
          {action.label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      className="bg-wv-primary text-white hover:bg-wv-primary-dark"
      onClick={action.onClick}
      aria-label={action.ariaLabel}
    >
      {action.label}
    </Button>
  );
}
