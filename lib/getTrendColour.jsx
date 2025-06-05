export default function getTrendColor(value, prev) {
  if (value === null || prev === null || prev === 0) return "gray";
  const diff = value - prev;
  const percent = (diff / prev) * 100;

  if (percent > 0.1) return "red";
  if (percent < -0.1) return "green";
  return "blue";
}
