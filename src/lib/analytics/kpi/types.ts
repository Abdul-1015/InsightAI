import type { SemanticType } from "../semantic/types";

export type AggregationType = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';

export interface KPIReason {
  type: 'semantic_type' | 'measure_candidate' | 'data_quality' | 'distribution' | 'cardinality';
  description: string;
}

export interface DiscoveredKPI {
  columnName: string;
  semanticType: SemanticType;
  aggregation: AggregationType;
  confidence: number;
  reasons: KPIReason[];
}

export interface DatasetKPIs {
  kpis: DiscoveredKPI[];
  discoveredAt: Date;
}
