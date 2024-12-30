export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getLastNDays(n: number): string[] {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
}
