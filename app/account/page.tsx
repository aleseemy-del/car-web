"use client";

import { DataGate } from "@/components/ui/DataGate";
import { ListSkeleton } from "@/components/skeletons/Skeletons";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";
import { carHealth } from "@/lib/status";
import { useApp } from "@/lib/store";

export default function AccountPage() {
  const { setActiveCar, notifications, setNotifications } = useApp();
  return (
    <DataGate skeleton={<ListSkeleton />}>
      {({ db, car }) => (
        <div className="space-y-7">
          <ScreenHeader title="حسابي" />

          <div className="flex items-center gap-3 rounded-card bg-surface p-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-ink">{db.user.name.charAt(0)}</span>
            <div>
              <p className="text-lg font-bold text-ink">{db.user.name}</p>
              <p dir="ltr" className="mt-0.5 text-start text-sm text-muted-ink">{db.user.phone}</p>
            </div>
          </div>

          <section>
            <SectionTitle title="سياراتي" />
            <ul className="overflow-hidden rounded-card bg-card">
              {db.cars.map((c, i) => {
                const on = c.id === car.id;
                return (
                  <li key={c.id} className={i === db.cars.length - 1 ? "" : "border-b border-line"}>
                    <button type="button" onClick={() => setActiveCar(c.id)} aria-pressed={on} className="flex w-full items-center gap-3 px-4 py-3.5 text-start hover:bg-card-2 focus-visible:outline-2 focus-visible:outline-accent">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-tile text-ink ${on ? "bg-accent" : "bg-surface"}`}><Icon name="car" size={22} /></span>
                      <span className="flex-1">
                        <span className="block text-base font-bold text-white">{c.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{c.model} · {formatNumber(c.mileageKm)} كم</span>
                      </span>
                      {on ? <span className="text-xs font-bold text-accent">النشطة</span> : <StatusIndicator status={carHealth(c)} dotOnly />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <SectionTitle title="الإعدادات" />
            <div className="overflow-hidden rounded-card bg-card">
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card-2 text-white"><Icon name="bell" size={18} /></span>
                <span className="flex-1 text-base text-white">تنبيهات الصيانة</span>
                <input type="checkbox" role="switch" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="peer sr-only" />
                <span aria-hidden className="relative h-7 w-12 rounded-full bg-line transition peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:start-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-transform peer-checked:after:-translate-x-5" />
              </label>
            </div>
          </section>
        </div>
      )}
    </DataGate>
  );
}
