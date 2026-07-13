import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type ContextChecklistItem = {
  label: string;
  active: boolean;
  complete: boolean;
};

export function ContextBuildingChecklist({ items }: { items: ContextChecklistItem[] }) {
  return (
    <ul className="space-y-4" aria-label="Wealth context preparation checklist">
      {items.map((item) => (
        <li
          key={item.label}
          className={cn(
            "flex items-center gap-3 text-sm transition-all duration-300",
            item.complete || item.active ? "text-white" : "text-white/42"
          )}
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              item.complete
                ? "border-[#96e4ca] bg-[#96e4ca] text-[#17211f] shadow-[0_0_22px_rgba(150,228,202,0.22)]"
                : item.active
                  ? "border-[#96e4ca] bg-[#96e4ca]/10 shadow-[0_0_18px_rgba(150,228,202,0.14)]"
                  : "border-white/12 bg-white/5"
            )}
            aria-hidden="true"
          >
            {item.complete ? <Check className="size-3.5" aria-hidden /> : null}
          </span>
          <span className={cn(item.active && "font-semibold")}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
