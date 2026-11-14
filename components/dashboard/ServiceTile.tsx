import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Tone } from "@/lib/types";

const BOX: Record<Tone, string> = { warning: "bg-accent", critical: "bg-critical", good: "bg-surface", neutral: "bg-surface" };

export type ServiceItem = { id: string; title: string; value: string; icon: string; tone: Tone };

export function ServiceTile({ id, title, value, icon, tone }: ServiceItem) {
  const alert = tone === "warning" || tone === "critical";
  return (
    <Link href={`/service/${id}`} aria-label={`${title}، ${value}`} className="flex flex-col items-center active:opacity-70">
      <span className={`flex h-14 w-14 items-center justify-center rounded-tile text-ink ${BOX[tone]}`}>
        <Icon name={icon} size={24} />
      </span>
      <span className={`mt-2 text-xs ${alert ? "font-bold text-white" : "text-muted"}`}>{title}</span>
      <span className={`mt-0.5 max-w-full truncate text-[10px] ${value === "سجّل" || alert ? "text-accent" : "text-muted"}`}>
        {value === "سجّل" ? "+ سجّل" : value}
      </span>
    </Link>
  );
}
