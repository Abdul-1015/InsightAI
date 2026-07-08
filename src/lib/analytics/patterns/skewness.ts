import type { SkewedDistribution } from "./types";
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

function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function calculateSkewness(values: number[]): number {
  if (values.length < 3) return 0;
  
  const n = values.length;
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);
  
  if (stdDev === 0) return 0;
  
  const cubedDiffs = values.map(v => Math.pow((v - mean) / stdDev, 3));
  const sumCubedDiffs = cubedDiffs.reduce((a, b) => a + b, 0);
  
  const skewness = (n / ((n - 1) * (n - 2))) * sumCubedDiffs;
  
  return Math.round(skewness * 1000) / 1000;
}

function getSkewnessDirection(skewness: number): 'left' | 'right' {
  return skewness >= 0 ? 'right' : 'left';
}

function getSkewnessSeverity(skewness: number): 'high' | 'moderate' | 'low' {
  const abs = Math.abs(skewness);
  if (abs >= 1) return 'high';
  if (abs >= 0.5) return 'moderate';
  return 'low';
}

export function detectSkewedDistributions(
  profiledColumns: ProfiledColumn[],
  rows: Record<string, unknown>[],
  threshold: number = 0.5
): SkewedDistribution[] {
  const skewed: SkewedDistribution[] = [];
  
  const numericColumns = profiledColumns.filter(col => col.statistics.type === 'numeric');
  
  for (const col of numericColumns) {
    const values = extractNumericValues(rows, col.name);
    if (values.length < 20) continue;
    
    const skewness = calculateSkewness(values);
    
    if (Math.abs(skewness) >= threshold) {
      skewed.push({
        columnName: col.name,
        skewness,
        direction: getSkewnessDirection(skewness),
        severity: getSkewnessSeverity(skewness),
      });
    }
  }
  
  return skewed.sort((a, b) => Math.abs(b.skewness) - Math.abs(a.skewness));
}
