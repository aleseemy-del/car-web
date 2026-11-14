import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Car } from "@/lib/types";
import { buildVehicleStats, carHealth } from "@/lib/status";
import { StatusIndicator } from "./StatusIndicator";
import { VehicleStats } from "./VehicleStats";

export function VehicleCard({ car }: { car: Car }) {
  return (
    <section className="rounded-hero bg-card px-4 pt-5 pb-3.5" aria-label={`بطاقة ${car.name}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-accent">{car.model}</p>
          <h2 className="mt-0.5 text-2xl font-bold text-white">{car.name}</h2>
          <div className="mt-2">
            <StatusIndicator status={carHealth(car)} suffix={car.plate} />
          </div>
        </div>
        <Link href="/maintenance" aria-label="تفاصيل السيارة" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink active:opacity-80">
          <Icon name="arrowUp" size={20} className="-scale-x-100" />
        </Link>
      </div>
      <div className="my-2 flex h-36 items-center justify-center text-white">
        <Icon name="car" size={110} strokeWidth={1.2} />
      </div>
      <VehicleStats stats={buildVehicleStats(car)} />
    </section>
  );
}
