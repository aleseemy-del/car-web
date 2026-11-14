import type { ServiceKey } from "./types";

export type ServiceMeta = {
  key: ServiceKey;
  title: string;
  /** اسم أيقونة lucide — يتحول في components/ui/Icon.tsx */
  icon: string;
  tips?: string[];
  action?: { label: string; bookLabel: string };
};

export const SERVICES: ServiceMeta[] = [
  { key: "oil", title: "الزيت", icon: "droplets", action: { label: "احجز تغيير زيت", bookLabel: "تغيير زيت" } },
  { key: "battery", title: "البطارية", icon: "battery", tips: ["حرارة الصيف في الكويت تقصّر عمر البطارية — افحصها إذا عمرها فوق سنتين."], action: { label: "احجز فحص بطارية", bookLabel: "فحص بطارية" } },
  { key: "tires", title: "الإطارات", icon: "tire", tips: ["الحرارة ترفع ضغط الإطارات — افحصها الصبح وهي باردة."], action: { label: "احجز ترصيص وميزان", bookLabel: "ترصيص وميزان" } },
  { key: "brakes", title: "الفرامل", icon: "brakes", action: { label: "احجز فحص فرامل", bookLabel: "فحص فرامل" } },
  { key: "ac", title: "المكيف", icon: "snowflake", tips: ["غيّر فلتر المكيف قبل الصيف — الغبار يضعف التبريد."], action: { label: "احجز صيانة مكيف", bookLabel: "صيانة مكيف" } },
  { key: "fuel", title: "الوقود", icon: "fuel" },
  { key: "inspection", title: "الفحص الفني", icon: "clipboard", tips: ["قبل الفحص: تأكد من الأنوار والإطارات والزجاج."] },
  { key: "insurance", title: "التأمين", icon: "shield", action: { label: "جدّد التأمين", bookLabel: "تجديد تأمين" } },
  { key: "wash", title: "الغسيل", icon: "sparkles" },
  { key: "roadside", title: "الطريق", icon: "truck", tips: ["في الحالات الطارئة اتصل على 112."] },
];

export const HOME_SERVICE_KEYS: ServiceKey[] = ["oil", "battery", "tires", "brakes", "ac", "fuel", "inspection", "insurance"];

export const serviceMeta = (key: string) => SERVICES.find((s) => s.key === key);

export const EXPENSE_CATEGORIES = {
  fuel: { label: "بنزين", icon: "fuel" },
  maintenance: { label: "صيانة", icon: "wrench" },
  wash: { label: "غسيل", icon: "sparkles" },
  insurance: { label: "تأمين", icon: "shield" },
  parts: { label: "قطع غيار", icon: "cog" },
  other: { label: "أخرى", icon: "dots" },
} as const;

export const EXPENSE_ORDER = ["fuel", "maintenance", "wash", "insurance", "parts", "other"] as const;
