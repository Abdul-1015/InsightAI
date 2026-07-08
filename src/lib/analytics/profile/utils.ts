export function isNullValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function filterNonNull(values: unknown[]): unknown[] {
  return values.filter(v => !isNullValue(v));
}

export function countNulls(values: unknown[]): number {
  return values.filter(v => isNullValue(v)).length;
}

export function calculateNullPercent(nullCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((nullCount / totalCount) * 10000) / 100;
}

export function calculateUniquePercent(uniqueCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((uniqueCount / totalCount) * 10000) / 100;
}

export function sortNumericArray(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function calculateMedian(sortedValues: number[]): number {
  if (sortedValues.length === 0) return 0;
  
  const mid = Math.floor(sortedValues.length / 2);
  
  if (sortedValues.length % 2 === 0) {
    return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  }
  
  return sortedValues[mid];
}

export function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.round(Math.sqrt(avgSquaredDiff) * 1000) / 1000;
}

export function countValueFrequencies(values: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();
  
  for (const val of values) {
    frequencies.set(val, (frequencies.get(val) || 0) + 1);
  }
  
  return frequencies;
}

export function getTopValues(
  frequencies: Map<string, number>,
  limit: number = 10
): Array<{ value: string; count: number; percent: number }> {
  const total = Array.from(frequencies.values()).reduce((a, b) => a + b, 0);
  
  return Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({
      value,
      count,
      percent: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }));
}

export function parseDateValue(value: unknown): Date | null {
  if (isNullValue(value)) return null;
  
  const strValue = String(value).trim();
  if (strValue === '') return null;
  
  const date = new Date(strValue);
  
  if (isNaN(date.getTime())) return null;
  
  return date;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
