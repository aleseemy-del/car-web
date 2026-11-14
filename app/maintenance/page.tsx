"use client";

import { useState } from "react";
import { DataGate } from "@/components/ui/DataGate";
import { ListSkeleton } from "@/components/skeletons/Skeletons";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { NextMaintenanceCard } from "@/components/maintenance/NextMaintenanceCard";
import { MaintenanceItem } from "@/components/maintenance/MaintenanceItem";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/States";
import { Icon } from "@/components/ui/Icon";
import { formatDate, formatKwd } from "@/lib/format";
import { SERVICES } from "@/lib/services";
import { useApp } from "@/lib/store";
import type { ServiceKey } from "@/lib/types";

const LOGGABLE = SERVICES.filter((s) => ["oil", "battery", "tires", "brakes", "ac", "inspection", "insurance"].includes(s.key));

export default function MaintenancePage() {
  const { cancelBooking } = useApp();
  const [filter, setFilter] = useState<"all" | ServiceKey>("all");

  return (
    <DataGate skeleton={<ListSkeleton />}>
      {({ db, car }) => {
        const bookings = db.bookings.filter((b) => b.carId === car.id).sort((a, b) => a.date.localeCompare(b.date));
        const all = db.logs.filter((l) => l.carId === car.id);
        const logs = all.filter((l) => filter === "all" || l.service === filter).sort((a, b) => b.date.localeCompare(a.date));
        const total = logs.reduce((s, l) => s + (l.costKwd ?? 0), 0);

        return (
          <div className="space-y-7">
            <ScreenHeader title="الصيانة" subtitle={car.name} />
            <NextMaintenanceCard car={car} />

            <section>
              <SectionTitle title="مواعيدك" />
              <div className="overflow-hidden rounded-card bg-card">
                {bookings.length === 0 ? (
                  <EmptyState icon="calendar" title="ما عندك مواعيد" hint="احجز موعد من بطاقة الصيانة القادمة فوق." />
                ) : (
                  <ul>
                    {bookings.map((b, i) => (
                      <li key={b.id} className={`flex items-center gap-3 px-4 py-3.5 ${i === bookings.length - 1 ? "" : "border-b border-line"}`}>
                        <span className="flex h-11 w-11 items-center justify-center rounded-tile bg-accent text-ink"><Icon name="calendar" size={20} /></span>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-white">{b.serviceLabel} · {b.workshop}</p>
                          <p className="mt-0.5 text-xs text-muted">{formatDate(b.date)} · {b.time}</p>
                        </div>
                        <button type="button" onClick={() => cancelBooking(b.id)} aria-label="إلغاء الموعد" className="text-muted hover:text-white focus-visible:outline-2 focus-visible:outline-accent">
                          <Icon name="close" size={22} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section>
              <SectionTitle title="سجل الصيانة" />
              {all.length > 0 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="تصفية السجل">
                  <Chip label="الكل" selected={filter === "all"} onClick={() => setFilter("all")} />
                  {LOGGABLE.map((s) => (
                    <Chip key={s.key} label={s.title} selected={filter === s.key} onClick={() => setFilter(s.key)} />
                  ))}
                </div>
              )}
              <div className="overflow-hidden rounded-card bg-card">
                {logs.length === 0 ? (
                  <EmptyState icon="wrench" title={all.length ? "ما فيه سجلات لهالنوع" : "ما سجّلت أي صيانة للحين"} hint={all.length ? "جرّب نوع ثاني من الفلتر." : "لما تسجّل صيانة تطلع هنا."} />
                ) : (
                  <ul>{logs.map((l, i) => <MaintenanceItem key={l.id} log={l} last={i === logs.length - 1} />)}</ul>
                )}
              </div>
              {total > 0 && (
                <div className="mt-3 flex justify-between px-1 text-sm">
                  <span className="text-muted">إجمالي التكلفة</span>
                  <span className="font-bold text-white">{formatKwd(total)}</span>
                </div>
              )}
            </section>
          </div>
        );
      }}
    </DataGate>
  );
}
