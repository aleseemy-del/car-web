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
          <div className="space-y-4 lg:space-y-6">
            <DashboardHeader userName={db.user.name} location="الكويت" hasNotifications={oilLeft != null && oilLeft <= OIL_WARN_KM} />
            <CarSwitcher cars={db.cars} activeId={car.id} onSelect={setActiveCar} />
            <div className="space-y-4 lg:grid lg:grid-cols-5 lg:items-start lg:gap-8 lg:space-y-0">
              <div className="lg:col-span-2">
                <VehicleCard car={car} />
              </div>
              <div className="space-y-4 lg:col-span-3 lg:space-y-6">
                <section className="pt-2 lg:rounded-card lg:bg-card lg:p-6">
                  <SectionTitle title="الخدمات" />
                  <ServiceGrid items={items} />
                </section>
                {car.oilDueKm != null && <NextMaintenanceCard car={car} />}
              </div>
            </div>
          </div>
        );
      }}
    </DataGate>
  );
}
