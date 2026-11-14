"use client";

import { DataGate } from "@/components/ui/DataGate";
import { HomeSkeleton } from "@/components/skeletons/Skeletons";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CarSwitcher } from "@/components/dashboard/CarSwitcher";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { ServiceGrid } from "@/components/dashboard/ServiceGrid";
import { NextMaintenanceCard } from "@/components/maintenance/NextMaintenanceCard";
import { HOME_SERVICE_KEYS, serviceMeta } from "@/lib/services";
import { serviceView, OIL_WARN_KM } from "@/lib/status";
import { useApp } from "@/lib/store";

export default function HomePage() {
  const { setActiveCar } = useApp();
  return (
    <DataGate skeleton={<HomeSkeleton />}>
      {({ db, car }) => {
        const items = HOME_SERVICE_KEYS.map((k) => {
          const m = serviceMeta(k)!;
          const v = serviceView(k, car, db.logs, db.expenses);
          return { id: k, title: m.title, icon: m.icon, value: v.value, tone: v.tone };
        });
        const oilLeft = car.oilDueKm != null ? car.oilDueKm - car.mileageKm : null;
        return (
          <div className="space-y-4">
            <DashboardHeader userName={db.user.name} location="الكويت" hasNotifications={oilLeft != null && oilLeft <= OIL_WARN_KM} />
            <CarSwitcher cars={db.cars} activeId={car.id} onSelect={setActiveCar} />
            <VehicleCard car={car} />
            <section className="pt-2">
              <SectionTitle title="الخدمات" />
              <ServiceGrid items={items} />
            </section>
            {car.oilDueKm != null && <NextMaintenanceCard car={car} />}
          </div>
        );
      }}
    </DataGate>
  );
}
