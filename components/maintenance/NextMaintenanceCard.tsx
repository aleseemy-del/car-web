"use client";

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { Car } from "@/lib/types";

/** بطاقة بيضاء: الصيانة القادمة + شريط التقدم + زر الحجز */
export function NextMaintenanceCard({ car }: { car: Car }) {
  const { addBooking } = useApp();

  if (car.oilDueKm == null) {
    return (
      <div className="rounded-card bg-surface p-4">
        <p className="text-xs text-muted-ink">الصيانة القادمة</p>
        <p className="mt-1 text-base font-bold text-ink">سجّل آخر تغيير زيت عشان نحسب الموعد القادم</p>
      </div>
    );
  }

  const remaining = Math.max(0, car.oilDueKm - car.mileageKm);
  const used = 1 - remaining / car.oilIntervalKm;

  const book = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return addBooking({ carId: car.id, serviceLabel: "تغيير زيت", workshop: "ورشة النخبة", date: d.toISOString().slice(0, 10), time: "10:00" });
  };

  return (
    <section className="rounded-card bg-surface p-4" aria-label="الصيانة القادمة">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-ink">الصيانة القادمة</p>
          <p className="mt-0.5 text-base font-bold text-ink">تغيير الزيت · بعد {formatNumber(remaining)} كم</p>
        </div>
        <span className="text-base font-bold text-accent-ink">{Math.round(used * 100)}٪</span>
      </div>
      <div className="my-3">
        <ProgressBar value={used} tone={remaining <= 500 ? "critical" : "warning"} onLight />
      </div>
      <div className="flex">
        <Button variant="dark" icon="next" onClick={book} successLabel="تم حجز الموعد">احجز موعد</Button>
      </div>
    </section>
  );
}
