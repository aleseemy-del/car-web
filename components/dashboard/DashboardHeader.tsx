import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function DashboardHeader({ userName, location, hasNotifications }: { userName: string; location?: string; hasNotifications?: boolean }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg font-bold text-ink">{userName.charAt(0)}</div>
        <div>
          <p className="text-xs text-muted">هلا،</p>
          <p className="text-lg font-bold text-white">{userName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {location && (
          <span className="flex items-center gap-1 text-xs text-muted">
            <Icon name="pin" size={14} />
            {location}
          </span>
        )}
        <Link href="/account" aria-label="الإشعارات" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink active:opacity-70">
          <Icon name="bell" size={20} />
          {hasNotifications && <span className="absolute end-3 top-2.5 h-2 w-2 rounded-full bg-accent" />}
        </Link>
      </div>
    </header>
  );
}
