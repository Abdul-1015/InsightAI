import type { DashboardLayout, DashboardWidget, LayoutInput } from "./types";
import type { DiscoveredKPI } from "../kpi/types";
import type { VisualizationRecommendation } from "../visualizations/types";
import { calculateWidgetSize } from "./sizing";
import { generateWidgetPositions } from "./positioning";

const MAX_KPI_WIDGETS = 5;
const MAX_CHART_WIDGETS = 10;
const MAX_TOTAL_WIDGETS = 15;

let widgetCounter = 0;

function generateWidgetId(): string {
  widgetCounter++;
  return `widget_${widgetCounter}`;
}

function resetWidgetCounter(): void {
  widgetCounter = 0;
}

function createKPIWidgets(kpis: DiscoveredKPI[]): Omit<DashboardWidget, 'position'>[] {
  const topKPIs = kpis
    .filter(kpi => kpi.confidence >= 0.5)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, MAX_KPI_WIDGETS);
  
  return topKPIs.map(kpi => ({
    id: generateWidgetId(),
    type: 'kpi_card' as const,
    title: `${kpi.aggregation} of ${kpi.columnName.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
    yAxis: kpi.columnName,
    aggregation: kpi.aggregation,
    confidence: kpi.confidence,
    size: 'small' as const,
  }));
}

function createChartWidgets(
  visualizations: VisualizationRecommendation[]
): Omit<DashboardWidget, 'position'>[] {
  const nonKPIVisualizations = visualizations
    .filter(v => v.chartType !== 'kpi_card')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, MAX_CHART_WIDGETS);
  
  return nonKPIVisualizations.map(viz => ({
    id: generateWidgetId(),
    type: viz.chartType,
    title: viz.title,
    xAxis: viz.xAxis,
    yAxis: viz.yAxis,
    aggregation: viz.aggregation,
    confidence: viz.confidence,
    size: calculateWidgetSize(viz),
  }));
}

function sortWidgetsByPriority(
  kpiWidgets: Omit<DashboardWidget, 'position'>[],
  chartWidgets: Omit<DashboardWidget, 'position'>[]
): Omit<DashboardWidget, 'position'>[] {
  const allWidgets = [...kpiWidgets, ...chartWidgets];
  
  return allWidgets.sort((a, b) => {
    if (a.type === 'kpi_card' && b.type !== 'kpi_card') return -1;
    if (a.type !== 'kpi_card' && b.type === 'kpi_card') return 1;
    
    return b.confidence - a.confidence;
  });
}

function limitWidgets(widgets: Omit<DashboardWidget, 'position'>[]): Omit<DashboardWidget, 'position'>[] {
  return widgets.slice(0, MAX_TOTAL_WIDGETS);
}

export function generateLayout(input: LayoutInput): DashboardLayout {
  resetWidgetCounter();
  
  const kpiWidgets = createKPIWidgets(input.kpis);
  const chartWidgets = createChartWidgets(input.visualizations);
  
  const sortedWidgets = sortWidgetsByPriority(kpiWidgets, chartWidgets);
  const limitedWidgets = limitWidgets(sortedWidgets);
  
  const positionedWidgets = generateWidgetPositions(limitedWidgets);
  
  return {
    widgets: positionedWidgets,
    gridColumns: 12,
    rowHeight: 80,
    generatedAt: new Date(),
  };
}
