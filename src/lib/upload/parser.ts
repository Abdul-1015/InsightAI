import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import type { Filetype, ColumnInfo, DataType } from "./types";

export interface ParseMetadata {
  columns: ColumnInfo[];
  rowCount: number;
  columnCount: number;
}

function detectDataType(value: unknown): DataType {
  if (value === null || value === undefined || value === '') {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    if (trimmed === '') {
      return 'null';
    }

    if (trimmed === 'true' || trimmed === 'false') {
      return 'boolean';
    }

    if (!isNaN(Number(trimmed))) {
      return 'number';
    }

    if (!isNaN(Date.parse(trimmed))) {
      return 'date';
    }

    return 'string';
  }

  return 'unknown';
}

function inferColumnTypes(rows: Record<string, unknown>[], columnNames: string[]): ColumnInfo[] {
  return columnNames.map((colName) => {
    const values = rows.map((row) => row[colName]);
    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    
    if (nonNullValues.length === 0) {
      return {
        name: colName,
        dataType: 'null' as DataType,
        nullable: true,
      };
    }

    const typeCounts: Record<DataType, number> = {
      string: 0,
      number: 0,
      boolean: 0,
      date: 0,
      null: 0,
      unknown: 0,
    };

    for (const value of nonNullValues) {
      const type = detectDataType(value);
      typeCounts[type]++;
    }

    let dominantType: DataType = 'string';
    let maxCount = 0;

    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type as DataType;
      }
    }

    return {
      name: colName,
      dataType: dominantType,
      nullable: values.length !== nonNullValues.length,
    };
  });
}

function parseCSV(buffer: Buffer): ParseMetadata {
  try {
    const records: Record<string, unknown>[] = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      to: 1000,
    });

    if (records.length === 0) {
      return {
        columns: [],
        rowCount: 0,
        columnCount: 0,
      };
    }

    const columnNames = Object.keys(records[0]);
    const columns = inferColumnTypes(records, columnNames);

    let totalCount = records.length;
    if (records.length >= 1000) {
      const fullRecords: Record<string, unknown>[] = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
      totalCount = fullRecords.length;
    }

    return {
      columns,
      rowCount: totalCount,
      columnCount: columnNames.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid CSV file: ${error.message}`);
    }
    throw new Error("Invalid CSV file: Unable to parse");
  }
}

function parseXLSX(buffer: Buffer): ParseMetadata {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error("XLSX file contains no sheets.");
    }

    const sheet = workbook.Sheets[sheetName];
    const records: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });

    if (records.length === 0) {
      return {
        columns: [],
        rowCount: 0,
        columnCount: 0,
      };
    }

    const columnNames = Object.keys(records[0]);
    const columns = inferColumnTypes(records, columnNames);

    return {
      columns,
      rowCount: records.length,
      columnCount: columnNames.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid XLSX file: ${error.message}`);
    }
    throw new Error("Invalid XLSX file: Unable to parse");
  }
}

export function parseFileMetadata(
  buffer: Buffer,
  fileType: Filetype
): ParseMetadata {
  try {
    switch (fileType) {
      case "csv":
        return parseCSV(buffer);
      case "xlsx":
        return parseXLSX(buffer);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse file: ${error.message}`);
    }
    throw new Error("Failed to parse file: Unknown error");
  }
}
