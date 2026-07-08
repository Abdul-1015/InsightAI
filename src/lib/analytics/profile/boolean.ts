import type { BooleanProfile, ProfileInput } from "./types";
import {
  filterNonNull,
  countNulls,
  calculateNullPercent,
} from "./utils";

function isTrueValue(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'on';
  }
  
  if (typeof value === 'number') return value === 1;
  
  return false;
}

function isFalseValue(value: unknown): boolean {
  if (typeof value === 'boolean') return !value;
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'false' || lower === 'no' || lower === '0' || lower === 'off';
  }
  
  if (typeof value === 'number') return value === 0;
  
  return false;
}

export function profileBooleanColumn(input: ProfileInput): BooleanProfile {
  const { values, totalCount } = input;
  
  const nullCount = countNulls(values);
  const nonNullValues = filterNonNull(values);
  
  const trueCount = nonNullValues.filter(v => isTrueValue(v)).length;
  const falseCount = nonNullValues.filter(v => isFalseValue(v)).length;
  
  const nullPercent = calculateNullPercent(nullCount, totalCount);
  const truePercent = totalCount > 0 ? Math.round((trueCount / totalCount) * 10000) / 100 : 0;
  const falsePercent = totalCount > 0 ? Math.round((falseCount / totalCount) * 10000) / 100 : 0;
  
  return {
    trueCount,
    truePercent,
    falseCount,
    falsePercent,
    nullCount,
    nullPercent,
  };
}
