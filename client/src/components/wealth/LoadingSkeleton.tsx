import { cn } from "@/lib/utils";

export type LoadingSkeletonVariant =
  | "metric-card"
  | "content-card"
  | "list"
  | "page-section";

export type LoadingSkeletonProps = {
  variant?: LoadingSkeletonVariant;
  rows?: number;
  className?: string;
};

export function LoadingSkeleton({
  variant = "content-card",
  rows = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === "metric-card") {
    return (
      <div
        className={cn(
          "rounded-wv-card border border-wv-border bg-wv-surface p-5 shadow-wv-card",
          className
        )}
        aria-busy="true"
        aria-label="Loading metric"
      >
        <SkeletonLine className="h-4 w-28" />
        <SkeletonLine className="mt-4 h-8 w-36" />
        <SkeletonLine className="mt-4 h-4 w-24" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Loading list">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={`skeleton-row-${index}`}
            className="rounded-wv-card border border-wv-border bg-wv-surface p-4"
          >
            <SkeletonLine className="h-4 w-2/3" />
            <SkeletonLine className="mt-3 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "page-section") {
    return (
      <section
        className={cn("space-y-5", className)}
        aria-busy="true"
        aria-label="Loading section"
      >
        <div>
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="mt-3 h-8 w-64 max-w-full" />
          <SkeletonLine className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LoadingSkeleton variant="metric-card" />
          <LoadingSkeleton variant="metric-card" />
          <LoadingSkeleton variant="metric-card" />
        </div>
      </section>
    );
  }

  return (
    <div
      className={cn(
        "rounded-wv-card border border-wv-border bg-wv-surface p-5 shadow-wv-card",
        className
      )}
      aria-busy="true"
      aria-label="Loading content"
    >
      <SkeletonLine className="h-5 w-2/5" />
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonLine
          key={`skeleton-content-${index}`}
          className={cn("mt-4 h-4", index === rows - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-full bg-wv-border/80 motion-reduce:animate-none",
        className
      )}
    />
  );
}
