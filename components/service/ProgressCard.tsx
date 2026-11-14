import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Tone } from "@/lib/types";

export function ProgressCard({ label, value, caption, tone }: { label: string; value: number; caption: string; tone: Tone }) {
  return (
    <section className="rounded-card bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-semibold text-ink">{label}</p>
        <p className={`text-base font-bold ${tone === "good" ? "text-ink" : "text-accent-ink"}`}>{Math.round(value * 100)}٪</p>
      </div>
      <ProgressBar value={value} tone={tone} onLight />
      <p className="mt-2 text-xs text-muted-ink">{caption}</p>
    </section>
  );
}
