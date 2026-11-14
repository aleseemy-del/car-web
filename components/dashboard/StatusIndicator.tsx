import type { VehicleStatus } from "@/lib/status";

const STATUS: Record<VehicleStatus, { dot: string; halo: string; label: string }> = {
  good: { dot: "bg-good", halo: "bg-good/25", label: "حالة ممتازة" },
  warning: { dot: "bg-accent", halo: "bg-accent/25", label: "تحتاج متابعة" },
  critical: { dot: "bg-critical", halo: "bg-critical/25", label: "تحتاج صيانة" },
  unknown: { dot: "bg-muted", halo: "bg-muted/25", label: "أكمل بيانات سيارتك" },
};

export function StatusIndicator({ status, suffix, dotOnly }: { status: VehicleStatus; suffix?: string; dotOnly?: boolean }) {
  const s = STATUS[status];
  return (
    <div className="flex items-center gap-1.5" aria-label={s.label}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${s.halo}`}>
        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {!dotOnly && (
        <span className="text-xs text-muted">
          {s.label}
          {suffix ? ` · ${suffix}` : ""}
        </span>
      )}
    </div>
  );
}
