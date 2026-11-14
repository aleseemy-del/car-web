export function Chip({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${selected ? "bg-accent text-ink" : "bg-card text-white"}`}
    >
      {label}
    </button>
  );
}
