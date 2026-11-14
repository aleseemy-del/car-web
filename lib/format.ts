export const formatNumber = (n: number) => Math.round(n).toLocaleString("en-US");

export const formatKwd = (n: number) =>
  `${Number.isInteger(n) ? n : n.toFixed(1)} د.ك`;

const dateFmt = new Intl.DateTimeFormat("ar-KW-u-nu-latn", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00`));

export const monthName = (m: number) =>
  ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][m];

export function daysUntil(iso: string, today = new Date()) {
  const a = new Date(`${iso}T00:00:00`).getTime();
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.round((a - b) / 86_400_000);
}

export function monthsAgo(iso: string, today = new Date()) {
  const d = new Date(`${iso}T00:00:00`);
  return (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth());
}
