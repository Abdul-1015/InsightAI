import React from 'react';
import type { WidgetProps } from '../types';

export const KPICardWidget: React.FC<WidgetProps> = ({ widget, data, className }) => {
  const kpiData = data as { value?: number | string; change?: number; trend?: 'up' | 'down' } | undefined;

  return (
    <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
      <div className="text-sm text-muted-foreground mb-1">{widget.title}</div>
      <div className="text-2xl font-bold text-foreground">
        {kpiData?.value ?? '--'}
      </div>
      {kpiData?.change !== undefined && (
        <div className={`text-xs mt-2 ${kpiData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {kpiData.trend === 'up' ? '↑' : '↓'} {Math.abs(kpiData.change)}%
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        {widget.yAxis && <span>Metric: {widget.yAxis}</span>}
        {widget.aggregation && <span> ({widget.aggregation})</span>}
      </div>
    </div>
  );
};
