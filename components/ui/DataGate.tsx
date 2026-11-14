"use client";

import type { ReactNode } from "react";
import { useApp } from "@/lib/store";
import type { Car, Db } from "@/lib/types";
import { ErrorState } from "./States";

/** يعرض الهيكل أثناء التحميل، والخطأ عند الفشل، وإلا المحتوى */
export function DataGate({ skeleton, children }: { skeleton: ReactNode; children: (d: { db: Db; car: Car }) => ReactNode }) {
  const { status, error, db, activeCar, reload } = useApp();
  if (status === "loading") return <div aria-busy aria-label="جاري التحميل">{skeleton}</div>;
  if (status === "error" || !db || !activeCar) return <ErrorState message={error ?? "ما لقينا بياناتك."} onRetry={reload} />;
  return <>{children({ db, car: activeCar })}</>;
}
