import { Icon } from "@/components/ui/Icon";

export function TipsCard({ tips }: { tips: string[] }) {
  return (
    <ul className="space-y-3 rounded-card border border-accent/40 bg-accent/10 p-4">
      {tips.map((t) => (
        <li key={t} className="flex gap-2">
          <Icon name="bulb" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span className="text-sm leading-6 text-white">{t}</span>
        </li>
      ))}
    </ul>
  );
}
