export function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-tile bg-card p-4">
          <dt className="text-xs text-muted">{s.label}</dt>
          <dd className="mt-1 text-base font-bold text-white">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
