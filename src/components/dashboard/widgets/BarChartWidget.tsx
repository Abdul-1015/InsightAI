import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { WidgetProps } from '../types';

export const BarChartWidget: React.FC<WidgetProps> = ({ widget, data, className }) => {
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

  const xAxis = widget.xAxis || Object.keys(chartData[0])[0];
  const yAxis = widget.yAxis || Object.keys(chartData[0]).find(k => k !== xAxis) || '';

  return (
    <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
      <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxis} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey={yAxis} fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
