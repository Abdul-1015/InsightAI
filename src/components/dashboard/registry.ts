import type { WidgetRegistry } from './types';
import { KPICardWidget } from './widgets/KPICardWidget';
import { LineChartWidget } from './widgets/LineChartWidget';
import { BarChartWidget } from './widgets/BarChartWidget';
import { ColumnChartWidget } from './widgets/ColumnChartWidget';
import { PieChartWidget } from './widgets/PieChartWidget';
import { DonutChartWidget } from './widgets/DonutChartWidget';
import { ScatterPlotWidget } from './widgets/ScatterPlotWidget';
import { HistogramWidget } from './widgets/HistogramWidget';
import { TableWidget } from './widgets/TableWidget';

export const widgetRegistry: WidgetRegistry = {
  kpi_card: {
    component: KPICardWidget,
  },
  line: {
    component: LineChartWidget,
  },
  bar: {
    component: BarChartWidget,
  },
  column: {
    component: ColumnChartWidget,
  },
  pie: {
    component: PieChartWidget,
  },
  donut: {
    component: DonutChartWidget,
  },
  scatter: {
    component: ScatterPlotWidget,
  },
  histogram: {
    component: HistogramWidget,
  },
  table: {
    component: TableWidget,
  },
};

export function getWidgetComponent(chartType: string) {
  const entry = widgetRegistry[chartType as keyof typeof widgetRegistry];
  return entry?.component || null;
}
