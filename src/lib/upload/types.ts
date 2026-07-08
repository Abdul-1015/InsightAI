export type Filetype = 'csv' | 'xlsx' | 'json';

export interface DatasetMeta {
  id: string;
  name: string;
  fileType: Filetype;
  size: number;
  rowCount: number;
  columns: string[];
  uploadedAt: string;
  filePath: string;
}

export interface DatasetPreview {
  meta: DatasetMeta;
  rows: Record<string, unknown>[];
}

export interface UploadResult {
  success: boolean;
  dataset?: DatasetMeta;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
