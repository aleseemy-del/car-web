import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { VehicleStat } from "@/lib/status";

/** القراءات الثلاث أسفل بطاقة السيارة */
export function VehicleStats({ stats }: { stats: VehicleStat[] }) {
  return (
    <div className="flex border-t border-line pt-3">
      {stats.map((s, i) => (
        <Link
          key={s.label}
          href={s.target === "mileage" ? "/maintenance" : `/service/${s.target}`}
          className={`flex flex-1 flex-col items-center active:opacity-70 ${i > 0 ? "border-s border-line" : ""}`}
        >
          <span className={`mb-1.5 flex h-10 w-10 items-center justify-center rounded-full border ${s.highlight ? "border-accent text-accent" : s.missing ? "border-line text-muted" : "border-line text-white"}`}>
            <Icon name={s.icon} size={18} />
          </span>
          <span className="text-xs text-muted">{s.label}</span>
          {s.missing ? (
            <span className="mt-0.5 text-sm font-bold text-accent">+ سجّل</span>
          ) : (
            <span className={`mt-0.5 text-base font-bold ${s.highlight ? "text-accent" : "text-white"}`}>
              {s.value} <span className="text-xs font-normal text-muted">{s.unit}</span>
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
