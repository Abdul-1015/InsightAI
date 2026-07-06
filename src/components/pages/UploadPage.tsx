import { useState } from 'react';
import { Upload, FileSpreadsheet, FileJson, FileText, CheckCircle2, AlertCircle, Loader2, X, Plus, BarChart2, Database } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { revenueData } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'error';

interface UploadedFile {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'json';
  size: string;
  rows: number;
  status: UploadStatus;
  progress?: number;
}

const mockUploadedFiles: UploadedFile[] = [
  { id: '1', name: 'Q4_Revenue_2024.xlsx', type: 'excel', size: '2.4 MB', rows: 15420, status: 'ready' },
  { id: '2', name: 'customer_analytics.csv', type: 'csv', size: '890 KB', rows: 8234, status: 'ready' },
  { id: '3', name: 'marketing_spend.json', type: 'json', size: '156 KB', rows: 1205, status: 'ready' },
];

export function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>(mockUploadedFiles);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: 'new_file.csv',
      type: 'csv',
      size: '124 KB',
      rows: 523,
      status: 'uploading',
      progress: 0,
    };
    setFiles([...files, newFile]);
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'processing', progress: 50 } : f));
    }, 800);
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'ready', progress: 100 } : f));
    }, 1600);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'excel': return <FileSpreadsheet className="w-5 h-5 text-[#4F46E5]" />;
      case 'json': return <FileJson className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Upload Data</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload CSV, Excel, or JSON files for analysis.</p>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          'p-8 border-2 border-dashed transition-colors',
          isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-border hover:border-muted-foreground/30'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
          <button className="mt-4 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <Plus className="w-3.5 h-3.5" /> Browse Files
          </button>
        </div>
      </Card>

      {/* Uploaded Files */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Uploaded Files ({files.length})
          </h3>
          {files.length > 0 && (
            <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
              <BarChart2 className="w-3.5 h-3.5" /> Analyze All
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <div className="py-12 text-center">
            <Database className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {file.size} • {file.rows.toLocaleString()} rows
                  </div>
                </div>
                {file.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#4F46E5] rounded-full transition-all" style={{ width: `${file.progress || 0}%` }} />
                    </div>
                    <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />
                  </div>
                )}
                {file.status === 'processing' && (
                  <div className="flex items-center gap-2 text-xs text-amber-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                )}
                {file.status === 'ready' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Data Preview */}
      {files.some(f => f.status === 'ready') && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Data Preview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['Month', 'Revenue ($K)', 'Queries', 'Growth', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenueData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 px-3 text-foreground font-medium">{row.month}</td>
                    <td className="py-2 px-3 text-foreground">${row.revenue}K</td>
                    <td className="py-2 px-3 text-foreground">{row.queries.toLocaleString()}</td>
                    <td className="py-2 px-3 text-emerald-500 font-medium">+{Math.floor(Math.random() * 15 + 5)}%</td>
                    <td className="py-2 px-3">
                      <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">Processed</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}