import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

export type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <section
      className={cn(
        "rounded-wv-card border border-wv-error/30 bg-wv-surface p-6 text-wv-text shadow-wv-low",
        className
      )}
      role="alert"
      aria-labelledby="wealth-error-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-wv-error/10 text-wv-error">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="wealth-error-title" className="text-lg font-bold">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-wv-text-secondary">
            {message}
          </p>
          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-wv-border text-wv-text hover:bg-wv-background"
              onClick={onRetry}
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {retryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
