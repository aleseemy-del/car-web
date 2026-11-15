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
            <div className="space-y-7 lg:grid lg:grid-cols-5 lg:items-start lg:gap-8 lg:space-y-0">
            <div className="lg:col-span-2">
              <ExpenseSummary expenses={expenses} />
            </div>
            <section className="lg:col-span-3">
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
          </div>
        );
      }}
    </DataGate>
  );
}
