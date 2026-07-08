import type { AggregationType } from "../kpi/types";

export type ChartType =
  | 'kpi_card'
  | 'line'
  | 'bar'
  | 'column'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'histogram'
  | 'table';

export interface VisualizationRecommendation {
  chartType: ChartType;
  title: string;
  xAxis?: string;
  yAxis?: string;
  aggregation?: AggregationType;
  confidence: number;
  reason: string;
}

export interface DatasetVisualizations {
  recommendations: VisualizationRecommendation[];
  recommendedAt: Date;
}
