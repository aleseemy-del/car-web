export type Car = {
  id: string;
  name: string;
  model: string;
  plate: string;
  mileageKm: number;
  /** ممشى تغيير الزيت القادم */
  oilDueKm?: number;
  oilIntervalKm: number;
  insuranceExpiry?: string; // YYYY-MM-DD
};

export type ExpenseCategory = "fuel" | "maintenance" | "wash" | "insurance" | "parts" | "other";

export type Expense = {
  id: string;
  carId: string;
  category: ExpenseCategory;
  amountKwd: number;
  date: string; // YYYY-MM-DD
  odometerKm?: number;
  note?: string;
};

export type ServiceKey =
  | "oil" | "battery" | "tires" | "brakes" | "ac"
  | "fuel" | "inspection" | "insurance" | "wash" | "roadside";

export type ServiceLog = {
  id: string;
  carId: string;
  service: ServiceKey;
  date: string;
  mileageKm?: number;
  costKwd?: number;
  workshop?: string;
  note?: string;
  brand?: string;
};

export type Booking = {
  id: string;
  carId: string;
  serviceLabel: string;
  workshop: string;
  date: string;
  time: string;
};

export type User = { name: string; phone: string };

export type Db = {
  user: User;
  cars: Car[];
  expenses: Expense[];
  logs: ServiceLog[];
  bookings: Booking[];
};

export type Tone = "good" | "warning" | "critical" | "neutral";
