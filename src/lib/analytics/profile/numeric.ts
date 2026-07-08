import type { NumericProfile, ProfileInput } from "./types";
import {
  filterNonNull,
  countNulls,
  calculateNullPercent,
  calculateUniquePercent,
  sortNumericArray,
  calculateMedian,
  calculateStdDev,
} from "./utils";

export function profileNumericColumn(input: ProfileInput): NumericProfile {
  const { values, totalCount } = input;
  
  const nullCount = countNulls(values);
  const nonNullValues = filterNonNull(values)
    .map(v => Number(v))
    .filter(v => !isNaN(v));
  
  const uniqueCount = new Set(nonNullValues).size;
  const uniquePercent = calculateUniquePercent(uniqueCount, totalCount);
  const nullPercent = calculateNullPercent(nullCount, totalCount);
  
  if (nonNullValues.length === 0) {
    return {
      min: 0,
      max: 0,
      sum: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      nullCount,
      nullPercent,
      uniqueCount: 0,
      uniquePercent,
      zeroCount: 0,
    };
  }
  
  const sortedValues = sortNumericArray(nonNullValues);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  const sum = nonNullValues.reduce((a, b) => a + b, 0);
  const mean = sum / nonNullValues.length;
  const median = calculateMedian(sortedValues);
  const stdDev = calculateStdDev(nonNullValues, mean);
  const zeroCount = nonNullValues.filter(v => v === 0).length;
  
  return {
    min: Math.round(min * 1000) / 1000,
    max: Math.round(max * 1000) / 1000,
    sum: Math.round(sum * 1000) / 1000,
    mean: Math.round(mean * 1000) / 1000,
    median: Math.round(median * 1000) / 1000,
    stdDev,
    nullCount,
    nullPercent,
    uniqueCount,
    uniquePercent,
    zeroCount,
  };
}
