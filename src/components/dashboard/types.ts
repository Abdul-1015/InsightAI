import type { DashboardSpec, DashboardWidget, DashboardFilter } from '../../lib/analytics/dashboard/types';
import type { ChartType } from '../../lib/analytics/visualizations/types';

export interface WidgetProps {
  widget: DashboardWidget;
  data?: unknown;
  className?: string;
}

export interface DashboardRendererProps {
  spec: DashboardSpec;
  rows: Array<Record<string, unknown>>;
  className?: string;
  onWidgetClick?: (widget: DashboardWidget) => void;
  onFilterChange?: (filter: DashboardFilter, value: unknown) => void;
}

export interface WidgetRegistryEntry {
  component: React.ComponentType<WidgetProps>;
  fallback?: React.ComponentType<WidgetProps>;
}

export type WidgetRegistry = Record<ChartType, WidgetRegistryEntry>;
