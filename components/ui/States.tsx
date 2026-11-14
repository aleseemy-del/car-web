import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

/** حالة فارغة: ما فيه بيانات */
export function EmptyState({ icon = "dots", title, hint, action }: { icon?: string; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card-2 text-muted">
        <Icon name={icon} size={22} />
      </div>
      <p className="mt-3 text-base font-bold text-white">{title}</p>
      {hint && <p className="mt-1 text-sm leading-6 text-muted">{hint}</p>}
      {action && <div className="mt-4 flex w-full max-w-60">{action}</div>}
    </div>
  );
}

/** حالة خطأ مع زر إعادة المحاولة */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-card bg-card px-6 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-critical/15 text-critical">
        <Icon name="cloudOff" size={24} />
      </div>
      <p className="mt-3 text-base text-white">{message}</p>
      {onRetry && (
        <div className="mt-4 flex w-full max-w-52">
          <Button onClick={onRetry} icon="retry">حاول مرة ثانية</Button>
        </div>
      )}
    </div>
  );
}
