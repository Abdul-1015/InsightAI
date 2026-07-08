import type { ChartType, VisualizationRecommendation } from "../visualizations/types";
import type { DiscoveredKPI } from "../kpi/types";

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardWidget {
  id: string;
  type: ChartType;
  title: string;
  xAxis?: string;
  yAxis?: string;
  aggregation?: string;
  confidence: number;
  position: WidgetPosition;
  size: WidgetSize;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  gridColumns: number;
  rowHeight: number;
  generatedAt: Date;
}

export interface LayoutInput {
  kpis: DiscoveredKPI[];
  visualizations: VisualizationRecommendation[];
}
