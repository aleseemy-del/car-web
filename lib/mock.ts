import type { Db } from "./types";

// بيانات تجريبية — بنفس بيانات الديمو في تطبيق الجوال
export const MOCK_DB: Db = {
  user: { name: "عبدالرحمن", phone: "+965 5000 0000" },
  cars: [
    { id: "car-1", name: "Land Cruiser", model: "تويوتا · 2024", plate: "12 / 34567", mileageKm: 48250, oilDueKm: 49250, oilIntervalKm: 5000, insuranceExpiry: "2027-03-15" },
    { id: "car-2", name: "Camry", model: "تويوتا · 2021", plate: "45 / 98765", mileageKm: 72100, oilDueKm: 76000, oilIntervalKm: 5000, insuranceExpiry: "2026-12-01" },
  ],
  expenses: [
    { id: "e1", carId: "car-1", category: "fuel", amountKwd: 9, date: "2026-11-10", odometerKm: 48100 },
    { id: "e2", carId: "car-1", category: "wash", amountKwd: 4, date: "2026-11-08" },
    { id: "e3", carId: "car-1", category: "fuel", amountKwd: 8.5, date: "2026-11-03", odometerKm: 47640 },
    { id: "e4", carId: "car-1", category: "maintenance", amountKwd: 18, date: "2026-09-02", note: "تغيير زيت وفلتر", odometerKm: 44250 },
    { id: "e5", carId: "car-1", category: "fuel", amountKwd: 10, date: "2026-10-21", odometerKm: 46900 },
    { id: "e6", carId: "car-1", category: "insurance", amountKwd: 120, date: "2026-03-15" },
    { id: "e7", carId: "car-2", category: "fuel", amountKwd: 7, date: "2026-11-12", odometerKm: 72000 },
  ],
  logs: [
    { id: "l1", carId: "car-1", service: "oil", date: "2026-09-02", mileageKm: 44250, costKwd: 18, workshop: "ورشة النخبة" },
    { id: "l2", carId: "car-1", service: "insurance", date: "2026-03-15", costKwd: 120, note: "ينتهي 2027-03-15" },
    { id: "l3", carId: "car-1", service: "battery", date: "2026-05-20", mileageKm: 40100, costKwd: 35, workshop: "مركز الأمل", brand: "Bosch" },
    { id: "l4", carId: "car-1", service: "tires", date: "2026-07-11", mileageKm: 42300, costKwd: 160, workshop: "الإطارات الذهبية", brand: "Michelin" },
  ],
  bookings: [
    { id: "b1", carId: "car-1", serviceLabel: "تغيير زيت", workshop: "ورشة النخبة", date: "2026-11-20", time: "10:00" },
  ],
};
