import fs from "node:fs/promises";
import path from "node:path";
import { getDb } from "../db";
import { datasets } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { parseFile } from "./parse";
import type { DatasetMeta, Filetype, ColumnInfo, SemanticColumn } from "./types";
import type { DatasetStatProfile } from "../analytics/profile";
import type { DatasetPatterns } from "../analytics/patterns";

const DATASET_DETAIL_ROW_LIMIT = 100;

function datasetDir(userId: string, datasetId: string): string {
  const uploadsDir = path.resolve("uploads");
  return path.join(uploadsDir, userId, datasetId);
}

export interface DatasetDetail {
  meta: DatasetMeta;
  columns: string[];
  rowCount: number;
  rows: Record<string, unknown>[];
}

export async function getDatasetDetail(
  id: string,
  userId: string
): Promise<DatasetDetail | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(datasets)
    .where(and(eq(datasets.id, id), eq(datasets.userId, userId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const row = result[0];
  const meta: DatasetMeta = {
    id: row.id,
    userId: row.userId,
    originalName: row.originalName,
    storedName: row.storedName,
    fileType: row.fileType as Filetype,
    size: row.size,
    rowCount: row.rowCount,
    columns: row.columns as ColumnInfo[] | null,
    profile: row.profile as DatasetStatProfile | null,
    semantic: row.semantic as SemanticColumn[] | null,
    patterns: row.patterns as DatasetPatterns | null,
    uploadedAt: row.uploadedAt,
    status: row.status,
  };

  const dir = datasetDir(userId, id);
  const filePath = path.join(dir, meta.storedName);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const parsed = parseFile(fileBuffer, meta.fileType, DATASET_DETAIL_ROW_LIMIT);

    return {
      meta,
      columns: parsed.columns,
      rowCount: parsed.totalCount,
      rows: parsed.rows,
    };
  } catch (error) {
    console.error(`Failed to read dataset file for ${id}:`, error);
    return {
      meta,
      columns: [],
      rowCount: meta.rowCount || 0,
      rows: [],
    };
  }
}
