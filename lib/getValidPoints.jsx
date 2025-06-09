import dayjs from "dayjs";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";

export function getValidPoints(metrics, minutes = 10) {
  const now = dayjs();
  const start = now.subtract(minutes - 1, "minute").startOf("minute");

  // Exact tick points, one per minute
  const fixedTicks = Array.from({ length: minutes }, (_, i) =>
    start.add(i, "minute").valueOf()
  );

  const validPoints = uniqBy(
    filter(metrics, (m) => {
      const t = dayjs(m.time);
      return (
        t.isAfter(start.subtract(1, "second")) && // include exact match
        t.isBefore(now) &&
        (typeof m.memoryUsed === "number" ||
          typeof m.memoryFree === "number" ||
          typeof m.memoryCached === "number")
      );
    }),
    (m) => dayjs(m.time).toISOString()
  );

  return { validPoints, fixedTicks };
}
