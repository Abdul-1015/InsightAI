import React from 'react';
import type { WidgetProps } from '../types';

export const TableWidget: React.FC<WidgetProps> = ({ widget, data, className }) => {
  const tableData = data as Array<Record<string, unknown>> | undefined;

  if (!tableData || tableData.length === 0) {
    return (
      <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
        <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
        <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg">
          <div className="text-sm text-muted-foreground">No data available</div>
        </div>
      </div>
    );
  }

  const columns = Object.keys(tableData[0]);

  return (
    <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
      <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
      <div className="overflow-auto max-h-64">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(0, 10).map((row, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/50">
                {columns.map((col) => (
                  <td key={col} className="py-2 px-3 text-foreground">
                    {String(row[col] ?? '--')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableData.length > 10 && (
        <div className="text-xs text-muted-foreground mt-2">
          Showing 10 of {tableData.length} rows
        </div>
      )}
    </div>
  );
};
