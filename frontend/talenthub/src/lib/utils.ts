import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  startMonth: number,
  startYear: number,
  endMonth?: number,
  endYear?: number,
  isCurrent?: boolean
): string {
  const start = formatDate(startMonth, startYear);
  if (isCurrent) {
    return `${start} - Present`;
  }
  if (endMonth && endYear) {
    const end = formatDate(endMonth, endYear);
    return `${start} - ${end}`;
  }
  return start;
}
