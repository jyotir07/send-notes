// Activity dates are calendar days (YYYY-MM-DD) interpreted in local time. Never route them through
// `new Date('YYYY-MM-DD')`: that parses as UTC midnight and shows the previous day west of UTC.

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateKey(key: string, today: Date = new Date()): string {
  const date = fromDateKey(key);
  const todayKey = toDateKey(today);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  if (key === todayKey) return 'Today';
  if (key === toDateKey(tomorrow)) return 'Tomorrow';
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() !== today.getFullYear() && { year: 'numeric' }),
  });
}
