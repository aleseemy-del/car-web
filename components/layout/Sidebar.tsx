"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useApp } from "@/lib/store";
import { NAV_TABS } from "./nav";

/** شريط جانبي لنسخة الموقع (الشاشات الكبيرة) — على الجوال نستخدم الشريط السفلي */
export function Sidebar() {
  const path = usePathname();
  const { db } = useApp();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-e border-line bg-card px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2 focus-visible:outline-2 focus-visible:outline-accent">
        <span className="flex h-11 w-11 items-center justify-center rounded-tile bg-accent text-ink">
          <Icon name="car" size={24} />
        </span>
        <span className="text-lg font-bold text-white">حالة السيارة</span>
      </Link>

      <nav aria-label="التنقل الرئيسي" className="mt-8 flex-1">
        <ul className="space-y-1.5">
          {NAV_TABS.map((t) => {
            const active = t.href === "/" ? path === "/" || path.startsWith("/service") : path.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-12 items-center gap-3 rounded-full px-4 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${active ? "bg-accent text-ink" : "text-muted hover:bg-card-2 hover:text-white"}`}
                >
                  <Icon name={t.icon} size={20} />
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {db && (
        <div className="flex items-center gap-3 rounded-tile bg-card-2 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-ink">{db.user.name.charAt(0)}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{db.user.name}</p>
            <p className="text-xs text-muted">الكويت</p>
          </div>
        </div>
      )}
    </aside>
  );
}
