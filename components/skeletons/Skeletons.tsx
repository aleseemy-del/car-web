import { Skeleton } from "@/components/ui/Skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3"><Skeleton className="h-11 w-11 rounded-full" /><Skeleton className="h-10 w-32" /></div>
      <Skeleton className="h-[330px] rounded-hero" />
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      <Skeleton className="h-36 rounded-card" />
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-32 rounded-card" />
      <Skeleton className="h-64 rounded-card" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-52 rounded-hero" />
      <Skeleton className="h-24 rounded-card" />
      <div className="grid grid-cols-2 gap-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
    </div>
  );
}
