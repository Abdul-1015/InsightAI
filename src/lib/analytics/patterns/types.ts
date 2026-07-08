import type { SemanticType } from "../semantic/types";

export interface CorrelationPair {
  column1: string;
  column2: string;
  coefficient: number;
  strength: 'strong' | 'moderate' | 'weak';
  direction: 'positive' | 'negative';
}

export interface OutlierInfo {
  columnName: string;
  outlierCount: number;
  outlierPercent: number;
  lowerBound: number;
  upperBound: number;
  outlierValues: number[];
}

export interface SkewedDistribution {
  columnName: string;
  skewness: number;
  direction: 'left' | 'right';
  severity: 'high' | 'moderate' | 'low';
}

export interface MissingDataPattern {
  columnName: string;
  missingCount: number;
  missingPercent: number;
  severity: 'high' | 'moderate' | 'low';
}

export interface HighUniquenessPattern {
  columnName: string;
  uniquePercent: number;
  isCandidateKey: boolean;
}

export interface LowCardinalityPattern {
  columnName: string;
  uniqueCount: number;
  uniquePercent: number;
  topValues: Array<{ value: string; count: number }>;
}

export interface ConstantValuePattern {
  columnName: string;
  constantValue: unknown;
  uniqueCount: number;
}

export interface DimensionCandidate {
  columnName: string;
  semanticType: SemanticType;
  uniqueCount: number;
  reasons: string[];
}

export interface MeasureCandidate {
  columnName: string;
  semanticType: SemanticType;
  reasons: string[];
}

export interface ColumnPatterns {
  columnName: string;
  semanticType: SemanticType;
  outlier?: OutlierInfo;
  skewed?: SkewedDistribution;
  missing?: MissingDataPattern;
  highUniqueness?: HighUniquenessPattern;
  lowCardinality?: LowCardinalityPattern;
  constant?: ConstantValuePattern;
  isDimension?: DimensionCandidate;
  isMeasure?: MeasureCandidate;
}

export interface DatasetPatterns {
  correlations: CorrelationPair[];
  columnPatterns: ColumnPatterns[];
  dimensionCandidates: DimensionCandidate[];
  measureCandidates: MeasureCandidate[];
  discoveredAt: Date;
}
