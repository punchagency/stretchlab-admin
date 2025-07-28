import dayjs from "dayjs";

type FilterOption =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

interface CustomRange {
  start: string; 
  end: string;  
}

export function getLabels(
  filter: FilterOption,
  customRange?: CustomRange
): string[] {
  const today = dayjs();

  switch (filter) {
    case "today":
      return Array.from({ length: 12 }, (_, i) =>
        today.startOf("day").add(i * 2, "hour").format("h A")
      );

    case "yesterday":
      return Array.from({ length: 12 }, (_, i) =>
        today.subtract(1, "day").startOf("day").add(i * 2, "hour").format("h A")
      );

    case "last_7_days":
      return Array.from({ length: 7 }, (_, i) =>
        today.subtract(6 - i, "day").format("MMM D")
      );

    case "last_30_days":
      return Array.from({ length: 30 }, (_, i) =>
        today.subtract(29 - i, "day").format("MMM D")
      );

    case "this_month": {
      const dayCount = today.date(); // number of days so far
      return Array.from({ length: dayCount }, (_, i) =>
        today.startOf("month").add(i, "day").format("MMM D")
      );
    }

    case "last_month": {
      const lastMonth = today.subtract(1, "month").startOf("month");
      const daysInLastMonth = lastMonth.daysInMonth();

      return Array.from({ length: daysInLastMonth }, (_, i) =>
        lastMonth.add(i, "day").format("MMM D")
      );
    }

    case "this_year": {
      const monthCount = today.month() + 1; 
      return Array.from({ length: monthCount }, (_, i) =>
        dayjs().month(i).format("MMM")
      );
    }

    case "custom": {
      if (!customRange || !customRange.start || !customRange.end) return [];

      const start = dayjs(customRange.start);
      const end = dayjs(customRange.end);

      if (!start.isValid() || !end.isValid() || end.isBefore(start)) return [];

      const diffDays = end.diff(start, "day") + 1;

      return Array.from({ length: diffDays }, (_, i) =>
        start.add(i, "day").format("MMM D")
      );
    }

    default:
      return [];
  }
}

export function generateDummyData(labels: string[]): number[] {
  return labels.map(() => Math.floor(Math.random() * 100) + 10);
} 