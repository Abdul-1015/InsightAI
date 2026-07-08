import type { SemanticColumn } from "../semantic/types";
import type { DatasetStatProfile, ProfiledColumn } from "../profile/types";
import type { DatasetPatterns, MeasureCandidate } from "../patterns/types";
import type { DatasetKPIs, DiscoveredKPI, KPIReason } from "./types";
import { determineBestAggregation } from "./aggregation";
import { calculateConfidence } from "./confidence";

const EXCLUDED_SEMANTIC_TYPES = [
  'identifier',
  'email',
  'phone',
  'text',
  'null',
  'unknown',
];

function isExcludedColumn(col: ProfiledColumn): boolean {
  return EXCLUDED_SEMANTIC_TYPES.includes(col.semanticType);
}

function isNumericColumn(col: ProfiledColumn): boolean {
  return col.statistics.type === 'numeric';
}

function isMeasureCandidate(
  columnName: string,
  measureCandidates: MeasureCandidate[]
): boolean {
  return measureCandidates.some(mc => mc.columnName === columnName);
}

function buildKPIColumn(
  col: ProfiledColumn,
  measureCandidates: MeasureCandidate[]
): DiscoveredKPI | null {
  if (isExcludedColumn(col)) return null;
  if (!isNumericColumn(col)) return null;
  
  const { aggregation, reasons } = determineBestAggregation(col, col.name);
  
  const candidate = measureCandidates.find(mc => mc.columnName === col.name);
  if (candidate) {
    reasons.push({
      type: 'measure_candidate',
      description: `Listed as measure candidate: ${candidate.reasons.join(', ')}`,
    });
  }
  
  const confidence = calculateConfidence(col, reasons);
  
  if (confidence < 0.3) return null;
  
  return {
    columnName: col.name,
    semanticType: col.semanticType,
    aggregation,
    confidence,
    reasons,
  };
}

export function discoverKPIs(
  semanticColumns: SemanticColumn[],
  statProfile: DatasetStatProfile,
  patterns: DatasetPatterns
): DatasetKPIs {
  const kpis: DiscoveredKPI[] = [];
  
  const measureCandidates = patterns.measureCandidates;
  
  for (const col of statProfile.columns) {
    const kpi = buildKPIColumn(col, measureCandidates);
    if (kpi) {
      kpis.push(kpi);
    }
  }
  
  kpis.sort((a, b) => b.confidence - a.confidence);
  
  return {
    kpis,
    discoveredAt: new Date(),
  };
}
