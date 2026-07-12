import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";

export type CapabilityStatus = "works" | "partial" | "uiOnly" | "notImplemented";

export type AdvisorCapability = {
  label: string;
  status: CapabilityStatus;
  note: string;
};

export type AdvisorCapabilitiesProps = {
  capabilities: AdvisorCapability[];
};

const statusLabels: Record<CapabilityStatus, string> = {
  works: "Works now",
  partial: "Partially works",
  uiOnly: "UI only",
  notImplemented: "Not implemented",
};

export function AdvisorCapabilities({ capabilities }: AdvisorCapabilitiesProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card">
      <h2 className="text-base font-bold text-wv-text">Capabilities and limits</h2>
      <div className="mt-4 space-y-4">
        {capabilities.map((capability) => {
          const Icon =
            capability.status === "works"
              ? CheckCircle2
              : capability.status === "notImplemented"
                ? XCircle
                : CircleDashed;
          return (
            <div key={capability.label} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-wv-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-wv-text">{capability.label}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-wv-muted">
                  {statusLabels[capability.status]}
                </p>
                <p className="mt-1 text-sm leading-6 text-wv-text-secondary">
                  {capability.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
