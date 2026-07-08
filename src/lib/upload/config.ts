import path from "node:path";
import type { Filetype } from "./types";

export const UPLOAD_DIR = path.resolve("uploads");

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export const ALLOWED_TYPES: Record<string, Filetype> = {
  "text/csv": "csv",
  "application/vnd.ms-excel": "xlsx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

export const ALLOWED_EXTENSIONS: Record<string, Filetype> = {
  ".csv": "csv",
  ".xlsx": "xlsx",
  ".xls": "xlsx",
};

export const PREVIEW_ROW_LIMIT = 20;
