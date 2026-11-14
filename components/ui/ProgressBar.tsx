import type { Tone } from "@/lib/types";

const BAR: Record<Tone, string> = { good: "bg-good", warning: "bg-accent", critical: "bg-critical", neutral: "bg-accent" };

export function ProgressBar({ value, tone = "warning", onLight }: { value: number; tone?: Tone; onLight?: boolean }) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${onLight ? "bg-surface-2" : "bg-card-2"}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ${BAR[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
