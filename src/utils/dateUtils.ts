// Converts a Date to "YYYY-MM-DD" without timezone shifting
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Parses "YYYY-MM-DD" back to a local Date safely
export function fromDateString(str: string): Date {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Checks if two Dates fall on the same calendar day
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

// Returns all Date objects for a given month/year
export function getDaysInMonth(month: number, year: number): Date[] {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, i + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}
