import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./config";
import { getDb } from "../db";
import { datasets } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { parseFileMetadata } from "./parser";
import { parseFile } from "./parse";
import { analyzeColumns } from "../analytics/semantic";
import { profileDataset } from "../analytics/profile";
import { discoverPatterns } from "../analytics/patterns";
import type { DatasetMeta, Filetype, ColumnInfo, SemanticColumn } from "./types";
import type { DatasetStatProfile } from "../analytics/profile";
import type { DatasetPatterns } from "../analytics/patterns";

function userUploadDir(userId: string): string {
  return path.join(UPLOAD_DIR, userId);
}

function datasetDir(userId: string, datasetId: string): string {
  return path.join(userUploadDir(userId), datasetId);
}

async function ensureUserUploadDir(userId: string): Promise<void> {
  await fs.mkdir(userUploadDir(userId), { recursive: true });
}

function getFileExtension(fileType: Filetype): string {
  return fileType === "xlsx" ? ".xlsx" : ".csv";
}

export async function saveDataset(
  id: string,
  userId: string,
  originalName: string,
  fileType: Filetype,
  size: number,
  fileBuffer: Buffer
): Promise<DatasetMeta> {
  await ensureUserUploadDir(userId);
  const dir = datasetDir(userId, id);
  await fs.mkdir(dir, { recursive: true });

  const ext = getFileExtension(fileType);
  const storedName = `data${ext}`;
  const filePath = path.join(dir, storedName);
  await fs.writeFile(filePath, fileBuffer);

  const db = getDb();
  const now = new Date();
  
  let rowCount: number | null = null;
  let columns: ColumnInfo[] | null = null;
  let profile: DatasetStatProfile | null = null;
  let semantic: SemanticColumn[] | null = null;
  let patterns: DatasetPatterns | null = null;
  let status = "uploaded";

  try {
    const metadata = parseFileMetadata(fileBuffer, fileType);
    rowCount = metadata.rowCount;
    columns = metadata.columns;
    status = "parsed";

    const parsed = parseFile(fileBuffer, fileType, 1000);
    semantic = analyzeColumns(columns, parsed.rows);
    profile = profileDataset(columns, parsed.rows, semantic);
    patterns = discoverPatterns(semantic, profile, parsed.rows);
  } catch (error) {
    console.error(`Failed to parse file ${originalName}:`, error);
    status = "parse_error";
  }

  await db.insert(datasets).values({
    id,
    userId,
    originalName,
    storedName,
    fileType,
    size,
    rowCount,
    columns: columns as any,
    profile: profile as any,
    semantic: semantic as any,
    patterns: patterns as any,
    uploadedAt: now,
    status,
  });

  const meta: DatasetMeta = {
    id,
    userId,
    originalName,
    storedName,
    fileType,
    size,
    rowCount,
    columns,
    profile,
    semantic,
    patterns,
    uploadedAt: now,
    status,
  };

  return meta;
}

export async function getDatasetMeta(id: string, userId: string): Promise<DatasetMeta | null> {
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
  return {
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
}

export async function listDatasets(userId: string): Promise<DatasetMeta[]> {
  const db = getDb();
  const results = await db
    .select()
    .from(datasets)
    .where(eq(datasets.userId, userId))
    .orderBy(datasets.uploadedAt);

  return results.reverse().map((row) => ({
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
  }));
}

export async function getDatasetFilePath(id: string, userId: string): Promise<string | null> {
  const meta = await getDatasetMeta(id, userId);
  if (!meta) return null;
  return path.join(datasetDir(userId, id), meta.storedName);
}

export async function deleteDataset(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const dir = datasetDir(userId, id);
  
  try {
    await db
      .delete(datasets)
      .where(and(eq(datasets.id, id), eq(datasets.userId, userId)));
    
    await fs.rm(dir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
