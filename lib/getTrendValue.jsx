import { last } from "lodash";
import getTrendColor from "./getTrendColour";

export function getTrendValue(chartData, metricToUse) {
  if (!chartData || chartData.length < 1 || !metricToUse) {
    return { lastValue: null, changePct: null, statColor: "gray" };
  }

  const lastValue = last(chartData);
  const prevValue = chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const lastMetric = lastValue?.[metricToUse];
  const prevMetric = prevValue?.[metricToUse];

  const hasValidNumbers =
    typeof lastMetric === "number" && typeof prevMetric === "number";

  const changePct = hasValidNumbers
    ? ((lastMetric - prevMetric) / prevMetric) * 100
    : null;

  const statColor = hasValidNumbers
    ? getTrendColor(lastMetric, prevMetric)
    : "gray";

  return { lastValue, changePct, statColor };
}
