import { formatKwd, monthName } from "@/lib/format";
import { EXPENSE_CATEGORIES, EXPENSE_ORDER } from "@/lib/services";
import type { Expense } from "@/lib/types";

const ym = (iso: string) => iso.slice(0, 7);

/** بطاقة بيضاء: مصروف الشهر + مقارنة + توزيع حسب النوع */
export function ExpenseSummary({ expenses, today = new Date() }: { expenses: Expense[]; today?: Date }) {
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const thisKey = key(today);
  const prevKey = key(new Date(today.getFullYear(), today.getMonth() - 1, 1));

  const thisMonth = expenses.filter((e) => ym(e.date) === thisKey);
  const total = thisMonth.reduce((s, e) => s + e.amountKwd, 0);
  const prevTotal = expenses.filter((e) => ym(e.date) === prevKey).reduce((s, e) => s + e.amountKwd, 0);
  const diff = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;

  const odos = expenses.map((e) => e.odometerKm).filter((n): n is number => typeof n === "number");
  const km = odos.length >= 2 ? Math.max(...odos) - Math.min(...odos) : 0;
  const perKm = km > 0 ? (expenses.reduce((s, e) => s + e.amountKwd, 0) / km) * 1000 : null;

  const byCat = EXPENSE_ORDER.map((c) => ({ c, sum: thisMonth.filter((e) => e.category === c).reduce((s, e) => s + e.amountKwd, 0) })).filter((x) => x.sum > 0);
  const max = Math.max(1, ...byCat.map((x) => x.sum));

  return (
    <section className="rounded-card bg-surface p-4" aria-label="ملخص المصاريف">
      <p className="text-xs text-muted-ink">مصروف {monthName(today.getMonth())}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-bold text-ink">{formatKwd(total)}</p>
        {diff !== null && (
          <p className={`text-sm font-semibold ${diff > 0 ? "text-accent-ink" : "text-ink"}`}>
            {diff > 0 ? "▲" : "▼"} {Math.abs(diff)}٪ عن الشهر الماضي
          </p>
        )}
      </div>
      <div className="mt-4 flex border-t border-line-light pt-3">
        <div className="flex-1">
          <p className="text-xs text-muted-ink">تكلفة الكيلو</p>
          <p className="mt-0.5 text-base font-bold text-ink">{perKm ? `${Math.round(perKm)} فلس` : "—"}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-ink">عدد المصاريف</p>
          <p className="mt-0.5 text-base font-bold text-ink">{thisMonth.length}</p>
        </div>
      </div>
      {byCat.length > 0 && (
        <div className="mt-4 space-y-2">
          {byCat.map(({ c, sum }) => (
            <div key={c} className="flex items-center gap-2">
              <span className="w-16 text-xs text-muted-ink">{EXPENSE_CATEGORIES[c].label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(sum / max) * 100}%` }} />
              </div>
              <span className="w-14 text-end text-xs font-semibold text-ink">{formatKwd(sum)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
