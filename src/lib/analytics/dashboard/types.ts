import type { DatasetStatProfile } from "../profile";
import type { SemanticColumn } from "../semantic/types";
import type { DatasetPatterns } from "../patterns";
import type { DatasetKPIs, DiscoveredKPI } from "../kpi";
import type { DatasetVisualizations, VisualizationRecommendation } from "../visualizations";
import type { DashboardLayout, DashboardWidget } from "../layout";

export interface DashboardDatasetMeta {
  id: string;
  originalName: string;
  rowCount: number;
  columnCount: number;
  uploadedAt: Date;
}

export interface DashboardFilter {
  id: string;
  label: string;
  column: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
}

export interface DashboardSpec {
  version: string;
  dataset: DashboardDatasetMeta;
  kpis: DiscoveredKPI[];
  visualizations: VisualizationRecommendation[];
  layout: DashboardLayout;
  filters: DashboardFilter[];
  metadata: {
    generatedAt: Date;
    engineVersion: string;
    semantic: SemanticColumn[];
    profile: DatasetStatProfile | null;
    patterns: DatasetPatterns | null;
  };
}

export interface DashboardSpecInput {
  datasetId: string;
  datasetName: string;
  rowCount: number;
  uploadedAt: Date;
  semantic: SemanticColumn[];
  profile: DatasetStatProfile | null;
  patterns: DatasetPatterns | null;
  kpis: DatasetKPIs | null;
  visualizations: DatasetVisualizations | null;
  layout: DashboardLayout | null;
}
