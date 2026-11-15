"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { NAV_TABS } from "./nav";

/** شريط تنقل عائم على شكل كبسولة بيضاء — التبويب النشط برتقالي مع اسمه */
export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="التنقل" className="pointer-events-none fixed lg:hidden inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md px-7 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <ul className="pointer-events-auto flex items-center justify-between rounded-full bg-surface p-1.5 shadow-lg shadow-black/40">
        {NAV_TABS.map((t) => {
          const active = t.href === "/" ? path === "/" || path.startsWith("/service") : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                aria-label={t.label}
                className={`flex h-12 items-center justify-center gap-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-accent ${active ? "bg-accent px-4 text-ink" : "w-12 text-zinc-600"}`}
              >
                <Icon name={t.icon} size={20} />
                {active && <span className="text-sm font-bold">{t.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
