import type { DashboardWidget } from '../layout/types';
import type { DashboardSpec } from '../dashboard/types';

export type AggregationFunction = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';

export interface WidgetDataResult {
  widgetId: string;
  data: Array<Record<string, unknown>>;
}

export interface QueryContext {
  rows: Array<Record<string, unknown>>;
  spec: DashboardSpec;
}

export interface GroupByQuery {
  groupByColumn: string;
  aggregationColumn: string | null;
  aggregationFn: AggregationFunction;
}

export function parseAggregation(widget: DashboardWidget): GroupByQuery {
  return {
    groupByColumn: widget.xAxis || '',
    aggregationFn: (widget.aggregation as AggregationFunction) || 'COUNT',
    aggregationColumn: widget.yAxis || null,
  };
}

function getNestedValue(row: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = row;

  for (const key of keys) {
    if (current == null) return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;

  const num = Number(value);

  return Number.isNaN(num) ? null : num;
}

function applyAggregation(
  values: unknown[],
  fn: AggregationFunction,
  column: string | null
): unknown {
  if (fn === 'COUNT') {
    return values.length;
  }

  if (!column) return null;

  const numericValues = values
    .map((row) => {
      const val =
        typeof row === 'object' && row !== null
          ? getNestedValue(row as Record<string, unknown>, column)
          : row;

      return toNumber(val);
    })
    .filter((v): v is number => v !== null);

  if (numericValues.length === 0) {
    return null;
  }

  switch (fn) {
    case 'SUM':
      return numericValues.reduce((a, b) => a + b, 0);

    case 'AVG':
      return numericValues.reduce((a, b) => a + b, 0) / numericValues.length;

    case 'MIN':
      return Math.min(...numericValues);

    case 'MAX':
      return Math.max(...numericValues);

    default:
      return null;
  }
}

function groupBy(
  rows: Array<Record<string, unknown>>,
  groupByColumn: string,
  aggregationColumn: string | null,
  aggregationFn: AggregationFunction
): Array<Record<string, unknown>> {
  if (!groupByColumn) {
    const aggregated = applyAggregation(rows, aggregationFn, aggregationColumn);

    return [
      {
        value: aggregated,
      },
    ];
  }

  const groups = new Map<string, Array<Record<string, unknown>>>();

  for (const row of rows) {
    const groupValue = getNestedValue(row, groupByColumn);
    const key = String(groupValue ?? 'null');

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key)!.push(row);
  }

  const result: Array<Record<string, unknown>> = [];

  for (const [key, groupRows] of groups) {
    const aggregated = applyAggregation(
      groupRows,
      aggregationFn,
      aggregationColumn
    );

    result.push({
      [groupByColumn]: key,
      [aggregationColumn ?? 'value']: aggregated,
    });
  }

  return result;
}

function generateKPIData(
  widget: DashboardWidget,
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const query = parseAggregation(widget);

  const aggregated = applyAggregation(
    rows,
    query.aggregationFn,
    query.aggregationColumn
  );

  return [
    {
      value: aggregated,
      title: widget.title,
      aggregation: widget.aggregation,
      yAxis: widget.yAxis,
    },
  ];
}

function generateChartData(
  widget: DashboardWidget,
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const query = parseAggregation(widget);

  if (query.groupByColumn) {
    return groupBy(
      rows,
      query.groupByColumn,
      query.aggregationColumn,
      query.aggregationFn
    );
  }

  if (query.aggregationColumn) {
    const aggregated = applyAggregation(
      rows,
      query.aggregationFn,
      query.aggregationColumn
    );

    return [
      {
        [query.aggregationColumn]: aggregated,
      },
    ];
  }

  return rows.slice(0, 100);
}

function generateTableData(
  widget: DashboardWidget,
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const columns = [widget.xAxis, widget.yAxis].filter(Boolean);

  if (columns.length === 0) {
    return rows.slice(0, 50);
  }

  return rows.slice(0, 50).map((row) => {
    const filtered: Record<string, unknown> = {};

    for (const col of columns) {
      filtered[col!] = getNestedValue(row, col!);
    }

    return filtered;
  });
}

export function generateWidgetData(
  widget: DashboardWidget,
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  switch (widget.type) {
    case 'kpi_card':
      return generateKPIData(widget, rows);

    case 'line':
    case 'bar':
    case 'column':
    case 'pie':
    case 'donut':
    case 'scatter':
    case 'histogram':
      return generateChartData(widget, rows);

    case 'table':
      return generateTableData(widget, rows);

    default:
      return rows.slice(0, 100);
  }
}

export function generateAllWidgetData(
  spec: DashboardSpec,
  rows: Array<Record<string, unknown>>
): Map<string, Array<Record<string, unknown>>> {
  const dataMap = new Map<string, Array<Record<string, unknown>>>();

  for (const widget of spec.layout.widgets) {
    dataMap.set(widget.id, generateWidgetData(widget, rows));
  }

  return dataMap;
}