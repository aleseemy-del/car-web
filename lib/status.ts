import type { Car, Expense, ServiceKey, ServiceLog, Tone } from "./types";
import { daysUntil, formatDate, formatKwd, formatNumber, monthsAgo } from "./format";

export const OIL_WARN_KM = 1000;

export type VehicleStatus = "good" | "warning" | "critical" | "unknown";

export function carHealth(car: Car): VehicleStatus {
  const oilLeft = car.oilDueKm != null ? car.oilDueKm - car.mileageKm : null;
  const ins = car.insuranceExpiry ? daysUntil(car.insuranceExpiry) : null;
  if (oilLeft == null && ins == null) return "unknown";
  if ((oilLeft != null && oilLeft <= 0) || (ins != null && ins < 0)) return "critical";
  if ((oilLeft != null && oilLeft <= OIL_WARN_KM) || (ins != null && ins <= 30)) return "warning";
  return "good";
}

export type VehicleStat = { label: string; icon: string; value: string; unit: string; highlight?: boolean; missing?: boolean; target: ServiceKey | "mileage" };

export function buildVehicleStats(car: Car): VehicleStat[] {
  const oilLeft = car.oilDueKm != null ? car.oilDueKm - car.mileageKm : null;
  const ins = car.insuranceExpiry ? daysUntil(car.insuranceExpiry) : null;
  return [
    { label: "الممشى", icon: "road", value: formatNumber(car.mileageKm), unit: "كم", target: "mileage" },
    oilLeft == null
      ? { label: "الزيت", icon: "droplets", value: "", unit: "", missing: true, target: "oil" }
      : { label: "الزيت", icon: "droplets", value: formatNumber(Math.max(0, oilLeft)), unit: "كم", highlight: oilLeft <= OIL_WARN_KM, target: "oil" },
    ins == null
      ? { label: "التأمين", icon: "shield", value: "", unit: "", missing: true, target: "insurance" }
      : { label: "التأمين", icon: "shield", value: ins < 0 ? "منتهي" : String(ins), unit: ins < 0 ? "" : "يوم", highlight: ins <= 30, target: "insurance" },
  ];
}

export type ServiceView = {
  value: string;
  tone: Tone;
  headline: string;
  summary: string;
  recorded: boolean;
  progress?: { label: string; value: number; caption: string };
  stats: { label: string; value: string }[];
};

const lastLog = (logs: ServiceLog[], carId: string, key: ServiceKey) =>
  logs.filter((l) => l.carId === carId && l.service === key).sort((a, b) => b.date.localeCompare(a.date))[0];

const agoText = (iso: string) => {
  const m = monthsAgo(iso);
  return m <= 0 ? "هذا الشهر" : m === 1 ? "قبل شهر" : `قبل ${m} أشهر`;
};

export function serviceView(key: ServiceKey, car: Car, logs: ServiceLog[], expenses: Expense[]): ServiceView {
  const empty: ServiceView = { value: "سجّل", tone: "neutral", headline: "—", summary: "ما سجّلت شي لهالخدمة للحين", recorded: false, stats: [] };

  if (key === "oil") {
    if (car.oilDueKm == null) return { ...empty, summary: "سجّل آخر تغيير زيت عشان نحسب الموعد القادم" };
    const left = car.oilDueKm - car.mileageKm;
    const used = Math.min(1, Math.max(0, 1 - left / car.oilIntervalKm));
    const log = lastLog(logs, car.id, "oil");
    return {
      value: left <= 0 ? "متأخر" : `${formatNumber(left)} كم`,
      tone: left <= 0 ? "critical" : left <= OIL_WARN_KM ? "warning" : "good",
      headline: `${formatNumber(Math.max(0, left))} كم`,
      summary: left <= 0 ? "تجاوزت موعد تغيير الزيت" : "باقي على تغيير الزيت",
      recorded: true,
      progress: { label: "عمر الزيت", value: used, caption: `يتغير كل ${formatNumber(car.oilIntervalKm)} كم` },
      stats: [
        { label: "الموعد القادم", value: `${formatNumber(car.oilDueKm)} كم` },
        { label: "الممشى الحالي", value: `${formatNumber(car.mileageKm)} كم` },
        ...(log ? [{ label: "آخر تغيير", value: formatDate(log.date) }, { label: "الورشة", value: log.workshop ?? "—" }] : []),
      ],
    };
  }

  if (key === "insurance") {
    if (!car.insuranceExpiry) return empty;
    const d = daysUntil(car.insuranceExpiry);
    return {
      value: d < 0 ? "منتهي" : `${d} يوم`,
      tone: d < 0 ? "critical" : d <= 30 ? "warning" : "good",
      headline: d < 0 ? "منتهي" : `${d} يوم`,
      summary: d < 0 ? "انتهى تأمين سيارتك" : "باقي على انتهاء التأمين",
      recorded: true,
      stats: [{ label: "تاريخ الانتهاء", value: formatDate(car.insuranceExpiry) }],
    };
  }

  if (key === "fuel" || key === "wash") {
    const cat = key === "fuel" ? "fuel" : "wash";
    const list = expenses.filter((e) => e.carId === car.id && e.category === cat).sort((a, b) => b.date.localeCompare(a.date));
    if (!list.length) return empty;
    const total = list.reduce((s, e) => s + e.amountKwd, 0);
    return {
      value: agoText(list[0].date),
      tone: "neutral",
      headline: formatKwd(total),
      summary: key === "fuel" ? "إجمالي مصروف الوقود" : "إجمالي مصروف الغسيل",
      recorded: true,
      stats: [
        { label: "آخر مرة", value: formatDate(list[0].date) },
        { label: "عدد المرات", value: String(list.length) },
      ],
    };
  }

  if (key === "roadside") {
    return { value: "112", tone: "neutral", headline: "112", summary: "رقم الطوارئ", recorded: true, stats: [] };
  }

  // باقي الخدمات: من آخر سجل
  const log = lastLog(logs, car.id, key);
  if (!log) return empty;
  const m = monthsAgo(log.date);
  return {
    value: agoText(log.date),
    tone: m >= 12 ? "warning" : "good",
    headline: agoText(log.date),
    summary: m >= 12 ? "مر وقت طويل — يفضل تفحصها" : "آخر صيانة مسجّلة",
    recorded: true,
    stats: [
      { label: "التاريخ", value: formatDate(log.date) },
      ...(log.mileageKm ? [{ label: "الممشى وقتها", value: `${formatNumber(log.mileageKm)} كم` }] : []),
      ...(log.workshop ? [{ label: "الورشة", value: log.workshop }] : []),
      ...(log.brand ? [{ label: "الماركة", value: log.brand }] : []),
      ...(log.costKwd ? [{ label: "التكلفة", value: formatKwd(log.costKwd) }] : []),
    ],
  };
}
