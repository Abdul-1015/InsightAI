import type { ColumnInfo, DataType } from "./types";

export interface NumericStats {
  min: number;
  max: number;
  mean: number;
}

export interface CategoricalStats {
  topValues: Array<{ value: string; count: number }>;
}

export interface ColumnProfile {
  name: string;
  dataType: DataType;
  nullCount: number;
  uniqueCount: number;
  totalCount: number;
  numericStats?: NumericStats;
  categoricalStats?: CategoricalStats;
}

export interface DatasetProfile {
  columns: ColumnProfile[];
  totalRows: number;
}

function isNumericType(dataType: DataType): boolean {
  return dataType === 'number';
}

function isCategoricalType(dataType: DataType): boolean {
  return dataType === 'string' || dataType === 'boolean';
}

function profileNumericColumn(
  name: string,
  values: unknown[],
  totalCount: number
): ColumnProfile {
  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
  const nonNullValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  const uniqueCount = new Set(nonNullValues).size;

  if (nonNullValues.length === 0) {
    return {
      name,
      dataType: 'number',
      nullCount,
      uniqueCount: 0,
      totalCount,
    };
  }

  const min = Math.min(...nonNullValues);
  const max = Math.max(...nonNullValues);
  const mean = nonNullValues.reduce((a, b) => a + b, 0) / nonNullValues.length;

  return {
    name,
    dataType: 'number',
    nullCount,
    uniqueCount,
    totalCount,
    numericStats: {
      min,
      max,
      mean: Math.round(mean * 1000) / 1000,
    },
  };
}

function profileCategoricalColumn(
  name: string,
  values: unknown[],
  dataType: DataType,
  totalCount: number
): ColumnProfile {
  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
  const nonNullValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => String(v));

  const uniqueCount = new Set(nonNullValues).size;

  const valueCounts = new Map<string, number>();
  for (const val of nonNullValues) {
    valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
  }

  const topValues = Array.from(valueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));

  return {
    name,
    dataType,
    nullCount,
    uniqueCount,
    totalCount,
    categoricalStats: { topValues },
  };
}

function profileDateColumn(
  name: string,
  values: unknown[],
  totalCount: number
): ColumnProfile {
  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
  const nonNullValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => String(v));

  const uniqueCount = new Set(nonNullValues).size;

  const valueCounts = new Map<string, number>();
  for (const val of nonNullValues) {
    valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
  }

  const topValues = Array.from(valueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));

  return {
    name,
    dataType: 'date',
    nullCount,
    uniqueCount,
    totalCount,
    categoricalStats: { topValues },
  };
}

function profileNullColumn(
  name: string,
  values: unknown[],
  totalCount: number
): ColumnProfile {
  const nullCount = values.filter(v => v === null || v === undefined || v === '').length;

  return {
    name,
    dataType: 'null',
    nullCount,
    uniqueCount: 0,
    totalCount,
  };
}

export function profileColumn(
  column: ColumnInfo,
  rows: Record<string, unknown>[]
): ColumnProfile {
  const values = rows.map(row => row[column.name]);
  const totalCount = rows.length;

  if (column.dataType === 'null') {
    return profileNullColumn(column.name, values, totalCount);
  }

  if (isNumericType(column.dataType)) {
    return profileNumericColumn(column.name, values, totalCount);
  }

  if (isCategoricalType(column.dataType)) {
    return profileCategoricalColumn(column.name, values, column.dataType, totalCount);
  }

  if (column.dataType === 'date') {
    return profileDateColumn(column.name, values, totalCount);
  }

  return profileCategoricalColumn(column.name, values, column.dataType, totalCount);
}

export function generateProfile(
  columns: ColumnInfo[],
  rows: Record<string, unknown>[]
): DatasetProfile {
  const columnProfiles = columns.map(col => profileColumn(col, rows));

  return {
    columns: columnProfiles,
    totalRows: rows.length,
  };
}
