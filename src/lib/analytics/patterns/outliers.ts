import type { OutlierInfo } from "./types";
import type { ProfiledColumn } from "../profile/types";

function extractNumericValues(
  rows: Record<string, unknown>[],
  columnName: string
): number[] {
  return rows
    .map(row => row[columnName])
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));
}

function sortNumericArray(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function calculateQuartile(sortedValues: number[], quartile: number): number {
  if (sortedValues.length === 0) return 0;
  
  const index = (quartile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) {
    return sortedValues[lower];
  }
  
  const fraction = index - lower;
  return sortedValues[lower] + fraction * (sortedValues[upper] - sortedValues[lower]);
}

function calculateIQR(sortedValues: number[]): { q1: number; q3: number; iqr: number } {
  const q1 = calculateQuartile(sortedValues, 25);
  const q3 = calculateQuartile(sortedValues, 75);
  const iqr = q3 - q1;
  
  return { q1, q3, iqr };
}

export function detectOutliers(
  profiledColumns: ProfiledColumn[],
  rows: Record<string, unknown>[]
): OutlierInfo[] {
  const outliers: OutlierInfo[] = [];
  
  const numericColumns = profiledColumns.filter(col => col.statistics.type === 'numeric');
  
  for (const col of numericColumns) {
    const values = extractNumericValues(rows, col.name);
    if (values.length < 20) continue;
    
    const sortedValues = sortNumericArray(values);
    const { q1, q3, iqr } = calculateIQR(sortedValues);
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outlierValues = values.filter(v => v < lowerBound || v > upperBound);
    
    if (outlierValues.length > 0) {
      const outlierPercent = (outlierValues.length / values.length) * 100;
      
      outliers.push({
        columnName: col.name,
        outlierCount: outlierValues.length,
        outlierPercent: Math.round(outlierPercent * 100) / 100,
        lowerBound: Math.round(lowerBound * 1000) / 1000,
        upperBound: Math.round(upperBound * 1000) / 1000,
        outlierValues: outlierValues.slice(0, 10).sort((a, b) => a - b),
      });
    }
  }
  
  return outliers.sort((a, b) => b.outlierPercent - a.outlierPercent);
}
