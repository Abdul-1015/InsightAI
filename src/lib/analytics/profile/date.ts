import type { DateProfile, ProfileInput } from "./types";
import {
  countNulls,
  calculateNullPercent,
  parseDateValue,
  formatDate,
} from "./utils";

export function profileDateColumn(input: ProfileInput): DateProfile {
  const { values, totalCount } = input;
  
  const nullCount = countNulls(values);
  const nullPercent = calculateNullPercent(nullCount, totalCount);
  
  const dates: Date[] = [];
  
  for (const value of values) {
    const date = parseDateValue(value);
    if (date !== null) {
      dates.push(date);
    }
  }
  
  if (dates.length === 0) {
    return {
      earliestDate: null,
      latestDate: null,
      dateRangeDays: null,
      nullCount,
      nullPercent,
    };
  }
  
  dates.sort((a, b) => a.getTime() - b.getTime());
  
  const earliestDate = dates[0];
  const latestDate = dates[dates.length - 1];
  
  const diffMs = latestDate.getTime() - earliestDate.getTime();
  const dateRangeDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  return {
    earliestDate: formatDate(earliestDate),
    latestDate: formatDate(latestDate),
    dateRangeDays,
    nullCount,
    nullPercent,
  };
}
