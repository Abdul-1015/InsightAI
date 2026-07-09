import React, { useMemo } from 'react';
import type { DashboardRendererProps } from './types';
import { WidgetRenderer } from './WidgetRenderer';
import { generateAllWidgetData } from '../../lib/analytics/query';

export const DashboardRenderer: React.FC<DashboardRendererProps> = ({
  spec,
  rows,
  className,
  onWidgetClick,
  onFilterChange,
}) => {
  const { layout, filters } = spec;
  const { widgets, gridColumns, rowHeight } = layout;

  const widgetDataMap = useMemo(
    () => generateAllWidgetData(spec, rows),
    [spec, rows]
  );

  const getGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gap: '1rem',
      gridAutoRows: `${rowHeight}px`,
    };
  };

  const getWidgetGridStyle = (widget: typeof widgets[0]) => {
    const { position } = widget;
    return {
      gridColumn: `${position.x + 1} / span ${position.w}`,
      gridRow: `${position.y + 1} / span ${position.h}`,
    };
  };

  return (
    <div className={`dashboard-renderer ${className || ''}`}>
      {filters && filters.length > 0 && (
        <div className="mb-6 p-4 bg-card border border-border rounded-xl">
          <div className="text-sm font-medium text-foreground mb-3">Filters</div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">{filter.label}:</label>
                <select
                  className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-foreground"
                  onChange={(e) => onFilterChange?.(filter, e.target.value)}
                >
                  <option value="">All</option>
                  {filter.options?.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={getGridStyle()}>
        {widgets.map((widget) => {
          const widgetData = widgetDataMap.get(widget.id);
          return (
            <div
              key={widget.id}
              style={getWidgetGridStyle(widget)}
              onClick={() => onWidgetClick?.(widget)}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <WidgetRenderer widget={widget} data={widgetData} className="h-full" />
            </div>
          );
        })}
      </div>

      {widgets.length === 0 && (
        <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
          <div className="text-lg mb-2">No widgets to display</div>
          <div className="text-sm">Upload a dataset to generate a dashboard</div>
        </div>
      )}
    </div>
  );
};
