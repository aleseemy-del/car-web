"use client";

import { DataGate } from "@/components/ui/DataGate";
import { ListSkeleton } from "@/components/skeletons/Skeletons";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseItem } from "@/components/expenses/ExpenseItem";
import { EmptyState } from "@/components/ui/States";

export default function ExpensesPage() {
  return (
    <DataGate skeleton={<ListSkeleton />}>
      {({ db, car }) => {
        const expenses = db.expenses.filter((e) => e.carId === car.id).sort((a, b) => b.date.localeCompare(a.date));
        return (
          <div className="space-y-7">
            <ScreenHeader title="المصاريف" subtitle={`${car.model.split(" · ")[0]} · ${car.name}`} />
            <ExpenseSummary expenses={expenses} />
            <section>
              <SectionTitle title="كل المصاريف" />
              <div className="overflow-hidden rounded-card bg-card">
                {expenses.length === 0 ? (
                  <EmptyState icon="wallet" title="ما فيه مصاريف" hint="لما تسجّل أول مصروف يطلع هنا." />
                ) : (
                  <ul>{expenses.map((e, i) => <ExpenseItem key={e.id} expense={e} last={i === expenses.length - 1} />)}</ul>
                )}
              </div>
            </section>
          </div>
        );
      }}
    </DataGate>
  );
}
