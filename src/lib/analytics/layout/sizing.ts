import type { WidgetSize } from "./types";
import type { ChartType } from "../visualizations/types";
import type { VisualizationRecommendation } from "../visualizations/types";

const CHART_SIZE_MAP: Record<ChartType, WidgetSize> = {
  kpi_card: 'small',
  line: 'large',
  bar: 'medium',
  column: 'medium',
  pie: 'medium',
  donut: 'medium',
  scatter: 'medium',
  histogram: 'medium',
  table: 'full',
};

const GRID_WIDTH_MAP: Record<WidgetSize, number> = {
  small: 3,
  medium: 4,
  large: 6,
  full: 12,
};

const GRID_HEIGHT_MAP: Record<WidgetSize, number> = {
  small: 2,
  medium: 4,
  large: 4,
  full: 4,
};

export function getWidgetSize(chartType: ChartType): WidgetSize {
  return CHART_SIZE_MAP[chartType] || 'medium';
}

export function getGridWidth(size: WidgetSize): number {
  return GRID_WIDTH_MAP[size];
}

export function getGridHeight(size: WidgetSize): number {
  return GRID_HEIGHT_MAP[size];
}

export function calculateWidgetSize(
  recommendation: VisualizationRecommendation
): WidgetSize {
  let size = CHART_SIZE_MAP[recommendation.chartType] || 'medium';
  
  if (recommendation.confidence >= 0.8) {
    if (size === 'medium') size = 'large';
    else if (size === 'small') size = 'medium';
  }
  
  return size;
}
