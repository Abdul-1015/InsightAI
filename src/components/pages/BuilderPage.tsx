import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, ArrowLeft, Database, ChevronDown } from 'lucide-react';
import { DashboardRenderer } from '../dashboard';
import type { DashboardSpec } from '../../lib/analytics/dashboard/types';

interface DatasetListItem {
  id: string;
  originalName: string;
  rowCount: number | null;
  uploadedAt: Date;
  status: string;
}

interface BuilderPageState {
  datasets: DatasetListItem[];
  selectedDatasetId: string | null;
  spec: DashboardSpec | null;
  rows: Array<Record<string, unknown>>;
  loading: boolean;
  error: string | null;
}

export function BuilderPage() {
  const [state, setState] = useState<BuilderPageState>({
    datasets: [],
    selectedDatasetId: null,
    spec: null,
    rows: [],
    loading: true,
    error: null,
  });

  const fetchDatasets = useCallback(async () => {
    try {
      const res = await fetch('/api/datasets');
      const result = await res.json();
      if (result.ok && Array.isArray(result.data)) {
        const datasets = result.data.map((d: DatasetListItem) => ({
          id: d.id,
          originalName: d.originalName,
          rowCount: d.rowCount,
          uploadedAt: d.uploadedAt,
          status: d.status,
        }));
        setState(prev => ({ ...prev, datasets }));

        if (datasets.length > 0) {
          const mostRecent = datasets[0];
          setState(prev => ({ ...prev, selectedDatasetId: mostRecent.id }));
          return mostRecent.id;
        }
      } else {
        setState(prev => ({ ...prev, error: result.error || 'Failed to load datasets' }));
      }
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to load datasets' }));
    }
    return null;
  }, []);

  const fetchDatasetSpec = useCallback(async (datasetId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`/api/datasets/${datasetId}`);
      const result = await res.json();
      if (result.ok && result.data?.meta?.dashboardSpec) {
        setState(prev => ({
          ...prev,
          spec: result.data.meta.dashboardSpec,
          rows: result.data.rows || [],
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'No dashboard specification found',
          loading: false,
        }));
      }
    } catch {
      setState(prev => ({ ...prev, error: 'Failed to load dashboard', loading: false }));
    }
  }, []);

  const selectDataset = useCallback((datasetId: string) => {
    setState(prev => ({ ...prev, selectedDatasetId: datasetId, spec: null, rows: [] }));
    fetchDatasetSpec(datasetId);
  }, [fetchDatasetSpec]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const datasetId = await fetchDatasets();
      if (!cancelled && datasetId) {
        fetchDatasetSpec(datasetId);
      } else if (!cancelled) {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    init();

    return () => { cancelled = true; };
  }, [fetchDatasets, fetchDatasetSpec]);

  const { datasets, selectedDatasetId, spec, rows, loading, error } = state;

  if (loading && datasets.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="p-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Loading datasets...</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading available datasets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (datasets.length === 0 && !loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="p-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">No datasets available</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No Datasets Found</h2>
            <p className="text-sm text-muted-foreground mb-4">Upload a dataset to generate a dashboard</p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] rounded-lg hover:bg-[#4338CA]"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Upload
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error && !spec) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="p-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Error loading dashboard</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium mb-1">Failed to load dashboard</p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => selectedDatasetId && fetchDatasetSpec(selectedDatasetId)}
              className="inline-flex items-center gap-2 text-sm text-[#4F46E5] hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedDataset = datasets.find(d => d.id === selectedDatasetId);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Dashboard Builder
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDataset ? selectedDataset.originalName : 'Select a dataset'}
            </p>
          </div>

          {/* Dataset Selector */}
          {datasets.length > 1 && (
            <div className="relative">
              <select
                value={selectedDatasetId || ''}
                onChange={(e) => selectDataset(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium bg-muted border border-border rounded-lg text-foreground cursor-pointer hover:bg-muted/80 focus:outline-none focus:border-[#4F46E5]"
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.originalName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {spec && (
            <span className="text-xs text-muted-foreground">
              {spec.dataset.rowCount.toLocaleString()} rows • {spec.layout.widgets.length} widgets
            </span>
          )}
          {selectedDatasetId && (
            <a
              href={`/datasets/${selectedDatasetId}`}
              className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted"
            >
              View Details
            </a>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : spec ? (
          <DashboardRenderer
            spec={spec}
            rows={rows}
            className="max-w-7xl mx-auto"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No dashboard data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
