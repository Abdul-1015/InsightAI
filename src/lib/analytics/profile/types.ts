import type { SemanticType } from "../semantic/types";

export interface NumericProfile {
  min: number;
  max: number;
  sum: number;
  mean: number;
  median: number;
  stdDev: number;
  nullCount: number;
  nullPercent: number;
  uniqueCount: number;
  uniquePercent: number;
  zeroCount: number;
}

export interface CategoricalProfile {
  uniqueCount: number;
  uniquePercent: number;
  nullCount: number;
  nullPercent: number;
  topValues: Array<{ value: string; count: number; percent: number }>;
  mostFrequentValue: string | null;
}

export interface BooleanProfile {
  trueCount: number;
  truePercent: number;
  falseCount: number;
  falsePercent: number;
  nullCount: number;
  nullPercent: number;
}

export interface DateProfile {
  earliestDate: string | null;
  latestDate: string | null;
  dateRangeDays: number | null;
  nullCount: number;
  nullPercent: number;
}

export interface NullProfile {
  nullCount: number;
  nullPercent: number;
}

export type ColumnStatistics =
  | { type: 'numeric'; stats: NumericProfile }
  | { type: 'categorical'; stats: CategoricalProfile }
  | { type: 'boolean'; stats: BooleanProfile }
  | { type: 'date'; stats: DateProfile }
  | { type: 'null'; stats: NullProfile };

export interface ProfiledColumn {
  name: string;
  semanticType: SemanticType;
  totalCount: number;
  statistics: ColumnStatistics;
}

export interface DatasetStatProfile {
  columns: ProfiledColumn[];
  totalRows: number;
  profiledAt: Date;
}

export interface ProfileInput {
  name: string;
  semanticType: SemanticType;
  values: unknown[];
  totalCount: number;
}
