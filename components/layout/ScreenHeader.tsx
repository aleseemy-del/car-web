import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export function ScreenHeader({ title, subtitle, backHref, right }: { title: string; subtitle?: string; backHref?: string; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-3">
        {backHref && (
          <Link href={backHref} aria-label="رجوع" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink active:opacity-70">
            <Icon name="back" size={20} />
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {right}
    </header>
  );
}
