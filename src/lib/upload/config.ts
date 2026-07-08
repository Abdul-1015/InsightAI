import path from "node:path";
import type { Filetype } from "./types";

export const UPLOAD_DIR = path.resolve("uploads");

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_TYPES: Record<string, Filetype> = {
  "text/csv": "csv",
  "application/vnd.ms-excel": "xlsx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/json": "json",
};

export const ALLOWED_EXTENSIONS: Record<string, Filetype> = {
  ".csv": "csv",
  ".xlsx": "xlsx",
  ".xls": "xlsx",
  ".json": "json",
};

export const PREVIEW_ROW_LIMIT = 20;
