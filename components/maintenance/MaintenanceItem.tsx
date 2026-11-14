import { Icon } from "@/components/ui/Icon";
import { formatDate, formatKwd, formatNumber } from "@/lib/format";
import { serviceMeta } from "@/lib/services";
import type { ServiceLog } from "@/lib/types";

export function MaintenanceItem({ log, last }: { log: ServiceLog; last?: boolean }) {
  const meta = serviceMeta(log.service);
  const line = [formatDate(log.date), log.mileageKm ? `${formatNumber(log.mileageKm)} كم` : null, log.workshop].filter(Boolean).join(" · ");
  return (
    <li className={`flex items-center gap-3 px-4 py-3.5 ${last ? "" : "border-b border-line"}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-surface text-ink">
        <Icon name={meta?.icon ?? "wrench"} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white">
          {meta?.title ?? log.service}
          {log.brand ? ` · ${log.brand}` : log.note ? ` · ${log.note}` : ""}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">{line}</p>
      </div>
      {log.costKwd ? <span className="text-sm font-bold text-white">{formatKwd(log.costKwd)}</span> : null}
    </li>
  );
}
