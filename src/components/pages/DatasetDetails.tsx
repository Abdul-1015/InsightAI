import { useState, useEffect } from 'react';
import {
  ArrowLeft, FileSpreadsheet, FileText, Loader2,
  Calendar, Hash, Columns, Database, AlertCircle,
  BarChart2, TrendingUp, Hash as HashIcon,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ColumnInfo {
  name: string;
  dataType: string;
  nullable: boolean;
}

interface NumericStats {
  min: number;
  max: number;
  sum: number;
  mean: number;
  median: number;
  stdDev: number;
  nullCount: number;
  nullPercent: number;
  uniqueCount: number;
  uniquePercent: number;
  zeroCount: number;
}

interface CategoricalStats {
  uniqueCount: number;
  uniquePercent: number;
  nullCount: number;
  nullPercent: number;
  topValues: Array<{ value: string; count: number; percent: number }>;
  mostFrequentValue: string | null;
}

interface BooleanStats {
  trueCount: number;
  truePercent: number;
  falseCount: number;
  falsePercent: number;
  nullCount: number;
  nullPercent: number;
}

interface DateStats {
  earliestDate: string | null;
  latestDate: string | null;
  dateRangeDays: number | null;
  nullCount: number;
  nullPercent: number;
}

interface ColumnStatistics {
  type: 'numeric' | 'categorical' | 'boolean' | 'date' | 'null';
  stats: NumericStats | CategoricalStats | BooleanStats | DateStats | { nullCount: number; nullPercent: number };
}

interface ProfiledColumn {
  name: string;
  semanticType: string;
  totalCount: number;
  statistics: ColumnStatistics;
}

interface DatasetStatProfile {
  columns: ProfiledColumn[];
  totalRows: number;
  profiledAt: Date;
}

interface DatasetMeta {
  id: string;
  userId: string;
  originalName: string;
  storedName: string;
  fileType: 'csv' | 'xlsx';
  size: number;
  rowCount: number | null;
  columns: ColumnInfo[] | null;
  profile: DatasetStatProfile | null;
  semantic: Array<{ name: string; dataType: string; semanticType: string; nullable: boolean }> | null;
  uploadedAt: Date;
  status: string;
}

interface DatasetDetail {
  meta: DatasetMeta;
  columns: string[];
  rowCount: number;
  rows: Record<string, unknown>[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString();
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

interface DatasetDetailsProps {
  datasetId: string;
}

export function DatasetDetails({ datasetId }: DatasetDetailsProps) {
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const res = await fetch(`/api/datasets/${datasetId}`);
        const result = await res.json();
        if (result.ok) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load dataset');
        }
      } catch {
        setError('Failed to load dataset');
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [datasetId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium mb-1">Error loading dataset</p>
            <p className="text-xs text-muted-foreground mb-4">{error || 'Dataset not found'}</p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 text-sm text-[#4F46E5] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </a>
          </div>
        </Card>
      </div>
    );
  }

  const { meta, columns, rowCount, rows } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <a
          href="/upload"
          className="mt-1 p-2 rounded-lg hover:bg-muted transition-colors"
          title="Back to Upload"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </a>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {meta.fileType === 'csv' ? (
              <FileText className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            ) : (
              <FileSpreadsheet className="w-6 h-6 text-[#4F46E5] flex-shrink-0" />
            )}
            <h1 className="text-xl font-bold text-foreground truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {meta.originalName}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-9">
            Dataset Details
          </p>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Uploaded</span>
          </div>
          <p className="text-sm text-foreground">{formatDate(meta.uploadedAt)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Rows</span>
          </div>
          <p className="text-sm text-foreground">{rowCount.toLocaleString()}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Columns className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Columns</span>
          </div>
          <p className="text-sm text-foreground">{columns.length}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Size</span>
          </div>
          <p className="text-sm text-foreground">{formatBytes(meta.size)}</p>
        </Card>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Status:</span>
        <Badge variant={meta.status === 'parsed' ? 'success' : meta.status === 'parse_error' ? 'danger' : 'info'}>
          {meta.status}
        </Badge>
      </div>

      {/* Column Info */}
      {meta.columns && meta.columns.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Column Information
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {meta.columns.map((col) => (
                  <tr key={col.name} className="border-b border-border last:border-0">
                    <td className="py-2 px-3 text-foreground font-medium">{col.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted">
                        {col.dataType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {col.nullable ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Data Profile */}
      {meta.profile && meta.profile.columns.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Data Profile
            </h3>
          </div>
          <div className="space-y-4">
            {meta.profile.columns.map((colProfile) => (
              <div key={colProfile.name} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{colProfile.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted">
                      {colProfile.semanticType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{colProfile.statistics.type === 'numeric' ? (colProfile.statistics.stats as NumericStats).uniqueCount.toLocaleString() : colProfile.statistics.type === 'categorical' ? (colProfile.statistics.stats as CategoricalStats).uniqueCount.toLocaleString() : ''} unique</span>
                    <span>{colProfile.statistics.type === 'numeric' ? (colProfile.statistics.stats as NumericStats).nullCount.toLocaleString() : colProfile.statistics.type === 'categorical' ? (colProfile.statistics.stats as CategoricalStats).nullCount.toLocaleString() : colProfile.statistics.type === 'boolean' ? (colProfile.statistics.stats as BooleanStats).nullCount.toLocaleString() : colProfile.statistics.type === 'date' ? (colProfile.statistics.stats as DateStats).nullCount.toLocaleString() : ''} null</span>
                  </div>
                </div>

                {/* Numeric Stats */}
                {colProfile.statistics.type === 'numeric' && (
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">Min</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{formatNumber((colProfile.statistics.stats as NumericStats).min)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <HashIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">Mean</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{formatNumber((colProfile.statistics.stats as NumericStats).mean)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">Max</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{formatNumber((colProfile.statistics.stats as NumericStats).max)}</p>
                    </div>
                  </div>
                )}

                {/* Categorical Stats */}
                {colProfile.statistics.type === 'categorical' && (colProfile.statistics.stats as CategoricalStats).topValues.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-medium text-muted-foreground mb-2 block">Top Values</span>
                    <div className="space-y-1">
                      {(colProfile.statistics.stats as CategoricalStats).topValues.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-foreground truncate max-w-[150px]">{item.value}</span>
                              <span className="text-[10px] text-muted-foreground">({item.count.toLocaleString()})</span>
                            </div>
                            <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-[#4F46E5] rounded-full" 
                                style={{ width: `${Math.min(item.percent, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground w-12 text-right">
                            {item.percent.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boolean Stats */}
                {colProfile.statistics.type === 'boolean' && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">True</span>
                      <p className="text-sm font-medium text-foreground">{(colProfile.statistics.stats as BooleanStats).trueCount.toLocaleString()} ({(colProfile.statistics.stats as BooleanStats).truePercent}%)</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">False</span>
                      <p className="text-sm font-medium text-foreground">{(colProfile.statistics.stats as BooleanStats).falseCount.toLocaleString()} ({(colProfile.statistics.stats as BooleanStats).falsePercent}%)</p>
                    </div>
                  </div>
                )}

                {/* Date Stats */}
                {colProfile.statistics.type === 'date' && (
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">Earliest</span>
                      <p className="text-sm font-medium text-foreground">{(colProfile.statistics.stats as DateStats).earliestDate || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">Latest</span>
                      <p className="text-sm font-medium text-foreground">{(colProfile.statistics.stats as DateStats).latestDate || 'N/A'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-[10px] font-medium text-muted-foreground block mb-1">Range (days)</span>
                      <p className="text-sm font-medium text-foreground">{(colProfile.statistics.stats as DateStats).dateRangeDays != null ? (colProfile.statistics.stats as DateStats).dateRangeDays!.toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Data Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Data Preview ({rows.length} of {rowCount.toLocaleString()} rows)
          </h3>
        </div>

        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col) => (
                    <th key={col} className="text-left py-2 px-3 font-medium text-muted-foreground whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                    {columns.map((col) => (
                      <td key={col} className="py-2 px-3 text-foreground whitespace-nowrap max-w-[200px] truncate">
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
    </div>
  );
}
