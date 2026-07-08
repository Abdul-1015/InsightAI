export type Filetype = 'csv' | 'xlsx';

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'null' | 'unknown';

export interface ColumnInfo {
  name: string;
  dataType: DataType;
  nullable: boolean;
}

export interface NumericStats {
  min: number;
  max: number;
  mean: number;
}

export interface CategoricalStats {
  topValues: Array<{ value: string; count: number }>;
}

export interface ColumnProfile {
  name: string;
  dataType: DataType;
  nullCount: number;
  uniqueCount: number;
  totalCount: number;
  numericStats?: NumericStats;
  categoricalStats?: CategoricalStats;
}

export interface DatasetProfile {
  columns: ColumnProfile[];
  totalRows: number;
}

export interface DatasetMeta {
  id: string;
  userId: string;
  originalName: string;
  storedName: string;
  fileType: Filetype;
  size: number;
  rowCount: number | null;
  columns: ColumnInfo[] | null;
  profile: DatasetProfile | null;
  uploadedAt: Date;
  status: string;
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
