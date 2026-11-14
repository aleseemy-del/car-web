import { ServiceTile, type ServiceItem } from "./ServiceTile";

/** شبكة 4 أعمدة */
export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-y-4">
      {items.map((i) => (
        <ServiceTile key={i.id} {...i} />
      ))}
    </div>
  );
}
