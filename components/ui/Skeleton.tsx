/** مربع ينبض مكان المحتوى وهو يحمّل */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-xl ${className}`} />;
}
