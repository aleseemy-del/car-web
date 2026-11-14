import { Icon } from "@/components/ui/Icon";
import type { Tone } from "@/lib/types";

export function ServiceHero({ icon, tone, headline, summary }: { icon: string; tone: Tone; headline: string; summary: string }) {
  const alert = tone === "warning" || tone === "critical";
  return (
    <section className="flex flex-col items-center rounded-hero bg-card px-5 py-7">
      <span className={`flex h-16 w-16 items-center justify-center rounded-3xl text-ink ${alert ? "bg-accent" : "bg-surface"}`}>
        <Icon name={icon} size={30} />
      </span>
      <p className={`mt-4 text-4xl font-bold ${alert ? "text-accent" : "text-white"}`}>{headline}</p>
      <p className="mt-1 text-center text-sm text-muted">{summary}</p>
    </section>
  );
}
