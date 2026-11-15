"use client";

import { use } from "react";
import { DataGate } from "@/components/ui/DataGate";
import { DetailSkeleton } from "@/components/skeletons/Skeletons";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { ServiceHero } from "@/components/service/ServiceHero";
import { ProgressCard } from "@/components/service/ProgressCard";
import { StatGrid } from "@/components/service/StatGrid";
import { TipsCard } from "@/components/service/TipsCard";
import { MaintenanceItem } from "@/components/maintenance/MaintenanceItem";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { serviceMeta } from "@/lib/services";
import { serviceView } from "@/lib/status";
import { useApp } from "@/lib/store";

export default function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const meta = serviceMeta(id);
  const { addBooking } = useApp();

  if (!meta) {
    return (
      <div className="space-y-6">
        <ScreenHeader title="الخدمة" backHref="/" />
        <EmptyState icon="dots" title="الخدمة غير موجودة" hint="ارجع للرئيسية واختر خدمة من الشبكة." />
      </div>
    );
  }

  return (
    <DataGate skeleton={<DetailSkeleton />}>
      {({ db, car }) => {
        const view = serviceView(meta.key, car, db.logs, db.expenses);
        const logs = db.logs.filter((l) => l.carId === car.id && l.service === meta.key).sort((a, b) => b.date.localeCompare(a.date));
        const book = () => {
          const d = new Date();
          d.setDate(d.getDate() + 3);
          return addBooking({ carId: car.id, serviceLabel: meta.action!.bookLabel, workshop: "ورشة النخبة", date: d.toISOString().slice(0, 10), time: "10:00" });
        };
        return (
          <div className="space-y-6">
            <ScreenHeader title={meta.title} subtitle={car.name} backHref="/" />
            <div className="space-y-6 lg:grid lg:grid-cols-5 lg:items-start lg:gap-8 lg:space-y-0">
            <div className="space-y-6 lg:col-span-2">
            <ServiceHero icon={meta.icon} tone={view.tone} headline={view.headline} summary={view.summary} />
            {view.progress && <ProgressCard {...view.progress} tone={view.tone === "neutral" ? "warning" : view.tone} />}
            {meta.action && (
              <div className="flex">
                <Button onClick={book} icon="calendar" successLabel="تم حجز الموعد">{meta.action.label}</Button>
              </div>
            )}
            </div>
            <div className="space-y-6 lg:col-span-3">
            {view.stats.length > 0 && (
              <section><SectionTitle title="التفاصيل" /><StatGrid items={view.stats} /></section>
            )}
            {meta.tips && (
              <section><SectionTitle title="نصائح" /><TipsCard tips={meta.tips} /></section>
            )}
            {logs.length > 0 && (
              <section>
                <SectionTitle title="سجلّك" />
                <ul className="overflow-hidden rounded-card bg-card">
                  {logs.map((l, i) => <MaintenanceItem key={l.id} log={l} last={i === logs.length - 1} />)}
                </ul>
              </section>
            )}
            </div>
            </div>
          </div>
        );
      }}
    </DataGate>
  );
}
