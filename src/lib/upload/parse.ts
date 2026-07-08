import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { PREVIEW_ROW_LIMIT } from "./config";
import type { Filetype } from "./types";

export interface ParseResult {
  columns: string[];
  rows: Record<string, unknown>[];
  totalCount: number;
}

export function parseFile(
  buffer: Buffer,
  fileType: Filetype
): ParseResult {
  switch (fileType) {
    case "csv":
      return parseCSV(buffer);
    case "xlsx":
      return parseXLSX(buffer);
    case "json":
      return parseJSON(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

function parseCSV(buffer: Buffer): ParseResult {
  const records: Record<string, unknown>[] = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return {
    columns,
    rows: records.slice(0, PREVIEW_ROW_LIMIT),
    totalCount: records.length,
  };
}

function parseXLSX(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("XLSX file contains no sheets.");
  }

  const sheet = workbook.Sheets[sheetName];
  const records: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
  });

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return {
    columns,
    rows: records.slice(0, PREVIEW_ROW_LIMIT),
    totalCount: records.length,
  };
}

function parseJSON(buffer: Buffer): ParseResult {
  const text = buffer.toString("utf-8");
  const parsed = JSON.parse(text);

  let records: Record<string, unknown>[];

  if (Array.isArray(parsed)) {
    records = parsed.map((item) =>
      typeof item === "object" && item !== null ? item : { value: item }
    );
  } else if (typeof parsed === "object" && parsed !== null) {
    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      records = parsed.data;
    } else {
      records = [parsed];
    }
  } else {
    records = [{ value: parsed }];
  }

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return {
    columns,
    rows: records.slice(0, PREVIEW_ROW_LIMIT),
    totalCount: records.length,
  };
}
