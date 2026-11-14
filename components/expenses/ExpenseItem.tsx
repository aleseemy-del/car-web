import { Icon } from "@/components/ui/Icon";
import { formatDate, formatKwd } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/services";
import type { Expense } from "@/lib/types";

export function ExpenseItem({ expense, last }: { expense: Expense; last?: boolean }) {
  const c = EXPENSE_CATEGORIES[expense.category];
  return (
    <li className={`flex items-center gap-3 px-4 py-3.5 ${last ? "" : "border-b border-line"}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-surface text-ink">
        <Icon name={c.icon} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-white">{expense.note ?? c.label}</p>
        <p className="mt-0.5 text-xs text-muted">{formatDate(expense.date)}</p>
      </div>
      <span className="text-sm font-bold text-white">{formatKwd(expense.amountKwd)}</span>
    </li>
  );
}
