import type { CorrelationPair } from "./types";
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

function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);
  
  const stdDevX = calculateStdDev(x, meanX);
  const stdDevY = calculateStdDev(y, meanY);
  
  if (stdDevX === 0 || stdDevY === 0) return 0;
  
  let sumXY = 0;
  for (let i = 0; i < n; i++) {
    sumXY += (x[i] - meanX) * (y[i] - meanY);
  }
  
  const covariance = sumXY / n;
  const correlation = covariance / (stdDevX * stdDevY);
  
  return Math.round(correlation * 1000) / 1000;
}

function getCoefficientStrength(coefficient: number): 'strong' | 'moderate' | 'weak' {
  const abs = Math.abs(coefficient);
  if (abs >= 0.7) return 'strong';
  if (abs >= 0.4) return 'moderate';
  return 'weak';
}

function getCoefficientDirection(coefficient: number): 'positive' | 'negative' {
  return coefficient >= 0 ? 'positive' : 'negative';
}

export function detectCorrelations(
  profiledColumns: ProfiledColumn[],
  rows: Record<string, unknown>[],
  threshold: number = 0.3
): CorrelationPair[] {
  const numericColumns = profiledColumns.filter(col => col.statistics.type === 'numeric');
  
  if (numericColumns.length < 2) return [];
  
  const numericData = new Map<string, number[]>();
  for (const col of numericColumns) {
    const values = extractNumericValues(rows, col.name);
    if (values.length > 0) {
      numericData.set(col.name, values);
    }
  }
  
  const correlations: CorrelationPair[] = [];
  const columnNames = Array.from(numericData.keys());
  
  for (let i = 0; i < columnNames.length; i++) {
    for (let j = i + 1; j < columnNames.length; j++) {
      const col1 = columnNames[i];
      const col2 = columnNames[j];
      
      const values1 = numericData.get(col1)!;
      const values2 = numericData.get(col2)!;
      
      const minLength = Math.min(values1.length, values2.length);
      if (minLength < 10) continue;
      
      const truncated1 = values1.slice(0, minLength);
      const truncated2 = values2.slice(0, minLength);
      
      const coefficient = pearsonCorrelation(truncated1, truncated2);
      
      if (Math.abs(coefficient) >= threshold) {
        correlations.push({
          column1: col1,
          column2: col2,
          coefficient,
          strength: getCoefficientStrength(coefficient),
          direction: getCoefficientDirection(coefficient),
        });
      }
    }
  }
  
  return correlations.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));
}
