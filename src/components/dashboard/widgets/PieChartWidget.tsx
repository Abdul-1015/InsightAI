import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { WidgetProps } from '../types';

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export const PieChartWidget: React.FC<WidgetProps> = ({ widget, data, className }) => {
  const chartData = data as Array<Record<string, unknown>> | undefined;

  if (!chartData || chartData.length === 0) {
    return (
      <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
        <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
        <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg">
          <div className="text-sm text-muted-foreground">No data available</div>
        </div>
      </div>
    );
  }

  const nameKey = widget.xAxis || Object.keys(chartData[0])[0];
  const valueKey = widget.yAxis || Object.keys(chartData[0]).find(k => k !== nameKey) || '';

  return (
    <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
      <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey={valueKey}
              nameKey={nameKey}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
