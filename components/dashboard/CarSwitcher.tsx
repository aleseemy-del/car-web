"use client";

import type { Car } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";

export function CarSwitcher({ cars, activeId, onSelect }: { cars: Car[]; activeId: string; onSelect: (id: string) => void }) {
  if (cars.length < 2) return null;
  return (
    <div className="flex gap-2 overflow-x-auto" role="group" aria-label="اختيار السيارة">
      {cars.map((c) => (
        <Chip key={c.id} label={c.name} selected={c.id === activeId} onClick={() => onSelect(c.id)} />
      ))}
    </div>
  );
}
