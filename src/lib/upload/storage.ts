import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./config";
import { parseFile } from "./parse";
import type { DatasetMeta, DatasetPreview, Filetype } from "./types";

const META_FILE = "meta.json";

async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function datasetDir(id: string): string {
  return path.join(UPLOAD_DIR, id);
}

function metaPath(id: string): string {
  return path.join(datasetDir(id), META_FILE);
}

export async function saveDataset(
  id: string,
  originalName: string,
  fileType: Filetype,
  size: number,
  rowCount: number,
  columns: string[],
  fileBuffer: Buffer
): Promise<DatasetMeta> {
  await ensureUploadDir();
  const dir = datasetDir(id);
  await fs.mkdir(dir, { recursive: true });

  const ext = fileType === "xlsx" ? ".xlsx" : fileType === "csv" ? ".csv" : ".json";
  const filePath = path.join(dir, `data${ext}`);
  await fs.writeFile(filePath, fileBuffer);

  const meta: DatasetMeta = {
    id,
    name: originalName,
    fileType,
    size,
    rowCount,
    columns,
    uploadedAt: new Date().toISOString(),
    filePath,
  };

  await fs.writeFile(metaPath(id), JSON.stringify(meta, null, 2));
  return meta;
}

export async function getDatasetMeta(id: string): Promise<DatasetMeta | null> {
  try {
    const data = await fs.readFile(metaPath(id), "utf-8");
    return JSON.parse(data) as DatasetMeta;
  } catch {
    return null;
  }
}

export async function listDatasets(): Promise<DatasetMeta[]> {
  await ensureUploadDir();
  const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });

  const datasets: DatasetMeta[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const meta = await getDatasetMeta(entry.name);
      if (meta) datasets.push(meta);
    }
  }

  datasets.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  return datasets;
}

export async function getDatasetPreview(id: string): Promise<DatasetPreview | null> {
  const meta = await getDatasetMeta(id);
  if (!meta) return null;

  try {
    const fileBuffer = await fs.readFile(meta.filePath);
    const parsed = parseFile(fileBuffer, meta.fileType);

    return { meta, rows: parsed.rows };
  } catch {
    return null;
  }
}

export async function deleteDataset(id: string): Promise<boolean> {
  const dir = datasetDir(id);
  try {
    await fs.rm(dir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
