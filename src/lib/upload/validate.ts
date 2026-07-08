import { ALLOWED_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "./config";
import type { Filetype } from "./types";

export interface ValidationResult {
  valid: boolean;
  fileType?: Filetype;
  error?: string;
}

export function validateFile(
  filename: string,
  contentType: string | undefined,
  size: number
): ValidationResult {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.`,
    };
  }

  if (size === 0) {
    return { valid: false, error: "File is empty." };
  }

  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  const extType = ALLOWED_EXTENSIONS[ext];
  const mimeType = contentType ? ALLOWED_TYPES[contentType] : undefined;

  const fileType = extType || mimeType;

  if (!fileType) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed: CSV, XLSX, JSON.`,
    };
  }

  return { valid: true, fileType };
}
