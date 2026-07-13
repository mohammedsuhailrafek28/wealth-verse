import { cn } from "@/lib/utils";

export function ContextProgress({ value, className }: { value: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[#96e4ca] transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <p className="text-right text-[11px] font-bold tabular-nums tracking-[0.18em] text-[#96e4ca]">
        {safeValue}%
      </p>
    </div>
  );
}
