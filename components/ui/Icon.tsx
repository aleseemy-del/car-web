import {
  Battery, Bell, CalendarDays, Car, Check, ChevronLeft, ChevronRight, CircleAlert, ClipboardCheck, Cog, CloudOff,
  Disc3, Droplets, Ellipsis, Fuel, Home, MapPin, Plus, Route, ShieldCheck, Snowflake, Sparkles, Truck, User, Wallet,
  Wrench, X, ArrowUpRight, Lightbulb, Loader2, RotateCw, LogOut, Gauge, MessageCircle, SendHorizontal, type LucideProps,
} from "lucide-react";

const ICONS = {
  droplets: Droplets, battery: Battery, tire: Disc3, brakes: CircleAlert, snowflake: Snowflake, fuel: Fuel,
  clipboard: ClipboardCheck, shield: ShieldCheck, sparkles: Sparkles, truck: Truck, wrench: Wrench, cog: Cog,
  dots: Ellipsis, road: Route, car: Car, bell: Bell, calendar: CalendarDays, check: Check, close: X, plus: Plus,
  home: Home, wallet: Wallet, user: User, pin: MapPin, arrowUp: ArrowUpRight, bulb: Lightbulb, spinner: Loader2,
  retry: RotateCw, cloudOff: CloudOff, logout: LogOut, gauge: Gauge, back: ChevronRight, next: ChevronLeft, chat: MessageCircle, send: SendHorizontal,
} as const;

export type IconName = keyof typeof ICONS;

/** كل الأيقونات من مكان واحد — تقبل اسم الخدمة مباشرة */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = ICONS[name as IconName] ?? Wrench;
  return <C aria-hidden {...props} />;
}
