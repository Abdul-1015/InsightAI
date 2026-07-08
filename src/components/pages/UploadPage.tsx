import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, FileSpreadsheet, FileJson, FileText,
  AlertCircle, Loader2, Plus, Database, Trash2,
  Eye, EyeOff,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'error' | 'preview';

interface DatasetMeta {
  id: string;
  name: string;
  fileType: 'csv' | 'xlsx' | 'json';
  size: number;
  rowCount: number;
  columns: string[];
  uploadedAt: string;
}

interface PreviewData {
  columns: string[];
  rows: Record<string, unknown>[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function UploadPage() {
  const [datasets, setDatasets] = useState<DatasetMeta[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, { progress: number; status: UploadStatus; error?: string }>>(new Map());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDatasets = useCallback(async () => {
    try {
      const res = await fetch('/api/datasets');
      const data = await res.json();
      if (data.ok) {
        setDatasets(data.data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const uploadFile = async (file: File) => {
    const fileId = crypto.randomUUID();
    setUploadingFiles(prev => new Map(prev).set(fileId, { progress: 0, status: 'uploading' }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      const promise = new Promise<{ ok: boolean; data?: DatasetMeta; error?: string }>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadingFiles(prev => {
              const next = new Map(prev);
              const entry = next.get(fileId);
              if (entry) next.set(fileId, { ...entry, progress });
              return next;
            });
          }
        });

        xhr.addEventListener('load', () => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid response'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', '/api/datasets');
        xhr.send(formData);
      });

      setUploadingFiles(prev => {
        const next = new Map(prev);
        const entry = next.get(fileId);
        if (entry) next.set(fileId, { ...entry, status: 'processing', progress: 100 });
        return next;
      });

      const result = await promise;

      if (result.ok && result.data) {
        setUploadingFiles(prev => {
          const next = new Map(prev);
          next.delete(fileId);
          return next;
        });
        setDatasets(prev => [result.data!, ...prev]);
      } else {
        setUploadingFiles(prev => {
          const next = new Map(prev);
          next.set(fileId, { progress: 0, status: 'error', error: result.error || 'Upload failed' });
          return next;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadingFiles(prev => {
        const next = new Map(prev);
        next.set(fileId, { progress: 0, status: 'error', error: message });
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(uploadFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(uploadFile);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        setDatasets(prev => prev.filter(d => d.id !== id));
        if (previewId === id) {
          setPreviewId(null);
          setPreviewData(null);
        }
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const togglePreview = async (id: string) => {
    if (previewId === id) {
      setPreviewId(null);
      setPreviewData(null);
      return;
    }

    setPreviewId(id);
    setPreviewLoading(true);
    setPreviewData(null);

    try {
      const res = await fetch(`/api/datasets/${id}`);
      const data = await res.json();
      if (data.ok) {
        setPreviewData(data.data.rows ? { columns: data.data.meta.columns, rows: data.data.rows } : null);
      }
    } catch {
      setPreviewData(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-[#4F46E5]" />;
      case 'json': return <FileJson className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: UploadStatus) => {
    switch (status) {
      case 'ready': return <Badge variant="success">Ready</Badge>;
      case 'uploading': return <Badge variant="info">Uploading</Badge>;
      case 'processing': return <Badge variant="warning">Processing</Badge>;
      case 'error': return <Badge variant="danger">Error</Badge>;
      default: return null;
    }
  };

  const uploadingEntries = Array.from(uploadingFiles.entries());

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Upload Data</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload CSV, Excel, or JSON files for analysis.</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Area */}
      <Card
        className={cn(
          'p-8 border-2 border-dashed transition-colors cursor-pointer',
          isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-border hover:border-muted-foreground/30'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Drop files here or click to upload
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">
            Supports CSV, Excel (.xlsx, .xls), and JSON files. Maximum file size: 50MB.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2 text-xs bg-transparent border border-border text-foreground hover:bg-muted"
            onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
          >
            <Plus className="w-3.5 h-3.5" /> Browse Files
          </button>
        </div>
      </Card>

      {/* Uploading Files */}
      {uploadingEntries.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Uploading ({uploadingEntries.length})
          </h3>
          <div className="space-y-2">
            {uploadingEntries.map(([id, info]) => (
              <div key={id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />
                <div className="flex-1 min-w-0">
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F46E5] rounded-full transition-all"
                      style={{ width: `${info.progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {info.status === 'processing' ? 'Processing...' : `${info.progress}%`}
                  </div>
                </div>
                {info.status === 'error' && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {info.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Uploaded Files */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Uploaded Files ({datasets.length})
          </h3>
        </div>

        {datasets.length === 0 && uploadingEntries.length === 0 ? (
          <div className="py-12 text-center">
            <Database className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {getFileIcon(dataset.fileType)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{dataset.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatBytes(dataset.size)} &middot; {dataset.rowCount.toLocaleString()} rows &middot; {dataset.columns.length} columns
                  </div>
                </div>
                {getStatusBadge('ready')}
                <button
                  onClick={() => togglePreview(dataset.id)}
                  className={cn(
                    'w-7 h-7 rounded flex items-center justify-center transition-colors',
                    previewId === dataset.id
                      ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  title={previewId === dataset.id ? 'Hide preview' : 'Show preview'}
                >
                  {previewId === dataset.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => removeFile(dataset.id)}
                  disabled={deletingId === dataset.id}
                  className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {deletingId === dataset.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Data Preview */}
      {previewId && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Data Preview
            </h3>
            <button
              onClick={() => { setPreviewId(null); setPreviewData(null); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>

          {previewLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-5 h-5 text-[#4F46E5] animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Loading preview...</p>
            </div>
          ) : previewData && previewData.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {previewData.columns.map((col) => (
                      <th key={col} className="text-left py-2 px-3 font-medium text-muted-foreground whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {previewData.columns.map((col) => (
                        <td key={col} className="py-2 px-3 text-foreground whitespace-nowrap">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-muted-foreground italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">No preview data available.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
