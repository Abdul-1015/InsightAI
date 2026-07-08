import type { DashboardSpec, DashboardSpecInput, DashboardFilter } from "./types";
import type { DashboardWidget } from "../layout/types";

const ENGINE_VERSION = "1.0.0";
const SPEC_VERSION = "1.0.0";

function generateFilters(input: DashboardSpecInput): DashboardFilter[] {
  const filters: DashboardFilter[] = [];
  const semantic = input.semantic;

  if (!semantic) return filters;

  for (const col of semantic) {
    if (col.semanticType === 'category' || col.semanticType === 'boolean') {
      const filterType = col.semanticType === 'boolean' ? 'boolean' : 'text';
      filters.push({
        id: `filter_${col.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        label: col.name,
        column: col.name,
        type: filterType,
      });
    }
  }

  return filters.slice(0, 10);
}

function mergeVisualizations(
  input: DashboardSpecInput,
  layout: DashboardSpecInput['layout']
): DashboardSpec['visualizations'] {
  if (!input.visualizations) return [];

  const recommendations = input.visualizations.recommendations || [];

  if (!layout) return recommendations;

  const layoutWidgetIds = new Set(layout.widgets.map(w => w.id));
  const merged = recommendations.map(rec => {
    const widget = layout.widgets.find(
      w => w.title === rec.title || (w.xAxis === rec.xAxis && w.yAxis === rec.yAxis)
    );

    if (widget) {
      return {
        ...rec,
        layoutWidgetId: widget.id,
      };
    }

    return rec;
  });

  return merged;
}

export function generateDashboardSpec(input: DashboardSpecInput): DashboardSpec {
  const layout = input.layout || {
    widgets: [],
    gridColumns: 12,
    rowHeight: 80,
    generatedAt: new Date(),
  };

  const kpis = input.kpis?.kpis || [];
  const visualizations = input.visualizations?.recommendations || [];
  const filters = generateFilters(input);

  return {
    version: SPEC_VERSION,
    dataset: {
      id: input.datasetId,
      originalName: input.datasetName,
      rowCount: input.rowCount,
      columnCount: input.semantic?.length || 0,
      uploadedAt: input.uploadedAt,
    },
    kpis,
    visualizations,
    layout,
    filters,
    metadata: {
      generatedAt: new Date(),
      engineVersion: ENGINE_VERSION,
      semantic: input.semantic || [],
      profile: input.profile,
      patterns: input.patterns,
    },
  };
}
