import type { SemanticColumn } from "../semantic/types";
import type { DatasetStatProfile, ProfiledColumn } from "../profile/types";
import type {
  DatasetPatterns,
  ColumnPatterns,
  CorrelationPair,
  OutlierInfo,
  SkewedDistribution,
  MissingDataPattern,
  HighUniquenessPattern,
  LowCardinalityPattern,
  ConstantValuePattern,
  DimensionCandidate,
  MeasureCandidate,
} from "./types";
import { detectCorrelations } from "./correlation";
import { detectOutliers } from "./outliers";
import { detectSkewedDistributions } from "./skewness";
import {
  detectMissingData,
  detectHighUniqueness,
  detectLowCardinality,
  detectConstantValues,
} from "./data-quality";
import { detectDimensionCandidates, detectMeasureCandidates } from "./dimensions";

function buildColumnPatterns(
  col: ProfiledColumn,
  outliers: OutlierInfo[],
  skewed: SkewedDistribution[],
  missing: MissingDataPattern[],
  highUniqueness: HighUniquenessPattern[],
  lowCardinality: LowCardinalityPattern[],
  constant: ConstantValuePattern[],
  dimensions: DimensionCandidate[],
  measures: MeasureCandidate[]
): ColumnPatterns {
  const patterns: ColumnPatterns = {
    columnName: col.name,
    semanticType: col.semanticType,
  };
  
  const outlier = outliers.find(o => o.columnName === col.name);
  if (outlier) patterns.outlier = outlier;
  
  const skew = skewed.find(s => s.columnName === col.name);
  if (skew) patterns.skewed = skew;
  
  const miss = missing.find(m => m.columnName === col.name);
  if (miss) patterns.missing = miss;
  
  const uniq = highUniqueness.find(u => u.columnName === col.name);
  if (uniq) patterns.highUniqueness = uniq;
  
  const card = lowCardinality.find(l => l.columnName === col.name);
  if (card) patterns.lowCardinality = card;
  
  const constVal = constant.find(c => c.columnName === col.name);
  if (constVal) patterns.constant = constVal;
  
  const dim = dimensions.find(d => d.columnName === col.name);
  if (dim) patterns.isDimension = dim;
  
  const meas = measures.find(m => m.columnName === col.name);
  if (meas) patterns.isMeasure = meas;
  
  return patterns;
}

export function discoverPatterns(
  semanticColumns: SemanticColumn[],
  statProfile: DatasetStatProfile,
  rows: Record<string, unknown>[]
): DatasetPatterns {
  const profiledColumns = statProfile.columns;
  
  const correlations = detectCorrelations(profiledColumns, rows);
  const outliers = detectOutliers(profiledColumns, rows);
  const skewed = detectSkewedDistributions(profiledColumns, rows);
  const missing = detectMissingData(profiledColumns);
  const highUniqueness = detectHighUniqueness(profiledColumns);
  const lowCardinality = detectLowCardinality(profiledColumns);
  const constant = detectConstantValues(profiledColumns);
  const dimensions = detectDimensionCandidates(profiledColumns);
  const measures = detectMeasureCandidates(profiledColumns);
  
  const columnPatterns: ColumnPatterns[] = profiledColumns.map(col =>
    buildColumnPatterns(
      col,
      outliers,
      skewed,
      missing,
      highUniqueness,
      lowCardinality,
      constant,
      dimensions,
      measures
    )
  );
  
  return {
    correlations,
    columnPatterns,
    dimensionCandidates: dimensions,
    measureCandidates: measures,
    discoveredAt: new Date(),
  };
}
