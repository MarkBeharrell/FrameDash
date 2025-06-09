import { last } from "lodash";
import getTrendColor from "./getTrendColour";

export function getTrendValue(chartData, metricToUse) {
  const lastValue = last(chartData);
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const changePct =
    lastValue && prev
      ? ((lastValue[metricToUse] - prev[metricToUse]) / prev[metricToUse]) * 100
      : null;
  const statColor = getTrendColor(lastValue[metricToUse], prev[metricToUse]);

  return { lastValue, changePct, statColor };
}
