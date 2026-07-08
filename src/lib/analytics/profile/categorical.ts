import type { CategoricalProfile, ProfileInput } from "./types";
import {
  filterNonNull,
  countNulls,
  calculateNullPercent,
  calculateUniquePercent,
  countValueFrequencies,
  getTopValues,
} from "./utils";

export function profileCategoricalColumn(input: ProfileInput): CategoricalProfile {
  const { values, totalCount } = input;
  
  const nullCount = countNulls(values);
  const nonNullValues = filterNonNull(values).map(v => String(v));
  
  const uniqueCount = new Set(nonNullValues).size;
  const uniquePercent = calculateUniquePercent(uniqueCount, totalCount);
  const nullPercent = calculateNullPercent(nullCount, totalCount);
  
  const frequencies = countValueFrequencies(nonNullValues);
  const topValues = getTopValues(frequencies, 10);
  const mostFrequentValue = topValues.length > 0 ? topValues[0].value : null;
  
  return {
    uniqueCount,
    uniquePercent,
    nullCount,
    nullPercent,
    topValues,
    mostFrequentValue,
  };
}
