import type { ColumnInfo, DataType } from "../../upload/types";
import type { SemanticColumn, ColumnAnalysisInput } from "./types";
import { classifyColumn } from "./classifier";

function extractSampleValues(
  rows: Record<string, unknown>[],
  columnName: string,
  limit: number = 100
): unknown[] {
  return rows.slice(0, limit).map(row => row[columnName]).filter(v => v !== null && v !== undefined && v !== '');
}

function buildColumnInput(
  column: ColumnInfo,
  sampleValues: unknown[]
): ColumnAnalysisInput {
  return {
    name: column.name,
    dataType: column.dataType,
    sampleValues,
  };
}

export function analyzeColumns(
  columns: ColumnInfo[],
  sampleRows: Record<string, unknown>[]
): SemanticColumn[] {
  return columns.map(column => {
    const sampleValues = extractSampleValues(sampleRows, column.name);
    const input = buildColumnInput(column, sampleValues);
    const semanticType = classifyColumn(input);

    return {
      name: column.name,
      dataType: column.dataType,
      semanticType,
      nullable: column.nullable,
    };
  });
}
