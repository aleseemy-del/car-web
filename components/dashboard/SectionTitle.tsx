import type { ReactNode } from "react";

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between px-0.5">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {action}
    </div>
  );
}
