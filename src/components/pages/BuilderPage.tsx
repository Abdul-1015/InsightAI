import { useState } from 'react';
import { Plus, BarChart2, PieChart as PieIcon, TrendingUp, Table, Save, Share, Download, Settings, Layout, Maximize2, Move, Trash2, GripVertical, Sparkles, ChevronDown, RefreshCw, Copy, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { revenueData, pieData, weeklyData, forecastData, productData, userGrowthData } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type ChartType = 'bar' | 'line' | 'pie' | 'table';

interface Widget {
  id: string;
  type: ChartType;
  title: string;
  source: string;
  size: 'sm' | 'md' | 'lg';
  position: number;
}

const defaultWidgets: Widget[] = [
  { id: '1', type: 'bar', title: 'Monthly Revenue', source: 'revenueData', size: 'md', position: 0 },
  { id: '2', type: 'pie', title: 'User Segments', source: 'pieData', size: 'sm', position: 1 },
  { id: '3', type: 'line', title: 'Weekly Activity', source: 'weeklyData', size: 'md', position: 2 },
  { id: '4', type: 'table', title: 'Product Performance', source: 'productData', size: 'lg', position: 3 },
];

const chartTypes = [
  { type: 'bar' as ChartType, icon: BarChart2, label: 'Bar Chart' },
  { type: 'line' as ChartType, icon: TrendingUp, label: 'Line Chart' },
  { type: 'pie' as ChartType, icon: PieIcon, label: 'Pie Chart' },
  { type: 'table' as ChartType, icon: Table, label: 'Data Table' },
];

const dataSources = [
  { id: 'revenueData', name: 'Revenue Data', columns: ['month', 'revenue', 'queries'] },
  { id: 'pieData', name: 'User Segments', columns: ['name', 'value', 'color'] },
  { id: 'weeklyData', name: 'Weekly Activity', columns: ['day', 'uploads', 'queries'] },
  { id: 'forecastData', name: 'Forecast Data', columns: ['month', 'actual', 'forecast'] },
  { id: 'productData', name: 'Product Performance', columns: ['name', 'revenue'] },
  { id: 'userGrowthData', name: 'User Growth', columns: ['month', 'users'] },
];

function MiniChart({ type, source }: { type: ChartType; source: string }) {
  const data = source === 'revenueData' ? revenueData : source === 'weeklyData' ? weeklyData : source === 'productData' ? productData : userGrowthData;

  if (type === 'bar') {
    return (
      <div className="h-full flex items-end gap-1">
        {revenueData.slice(0, 8).map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-[#4F46E5] rounded-t" style={{ height: `${(d.revenue / 255) * 100}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-[#4F46E5] relative">
          <div className="absolute inset-0 rounded-full border-4 border-[#818CF8] border-t-transparent border-r-transparent transform rotate-45" />
        </div>
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className="h-full flex items-end">
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
            points={weeklyData.map((d, i) => `${(i / (weeklyData.length - 1)) * 100},${50 - (d.queries / 300) * 50}`).join(' ')}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground p-2">
      <div className="font-medium text-foreground mb-1">{productData[0].name}</div>
      <div>${productData[0].revenue}K</div>
    </div>
  );
}

export function BuilderPage() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const addWidget = (type: ChartType) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      source: 'revenueData',
      size: 'md',
      position: widgets.length,
    };
    setWidgets([...widgets, newWidget]);
    setIsAddingWidget(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Dashboard Builder</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Drag, drop, and customize your dashboard widgets</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <Share className="w-3.5 h-3.5" /> Share
          </button>
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
            <Save className="w-3.5 h-3.5" /> Save Dashboard
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Widget Panel */}
        <div className="w-64 border-r border-border bg-card p-4 overflow-y-auto hidden md:block">
          <h3 className="text-xs font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Add Widget</h3>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => addWidget(type)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-colors text-xs text-muted-foreground hover:text-[#4F46E5]"
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Data Sources</h3>
            <div className="space-y-1">
              {dataSources.map((source) => (
                <div key={source.id} className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="text-xs font-medium text-foreground">{source.name}</div>
                  <div className="text-[10px] text-muted-foreground">{source.columns.length} columns</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Canvas */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <Card
                key={widget.id}
                className={cn(
                  'p-4 cursor-pointer transition-all',
                  selectedWidget === widget.id && 'ring-2 ring-[#4F46E5]',
                  widget.size === 'lg' && 'md:col-span-2'
                )}
                onClick={() => setSelectedWidget(widget.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <h4 className="text-xs font-semibold text-foreground">{widget.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="text-[9px]">{widget.source}</Badge>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="h-32">
                  <MiniChart type={widget.type} source={widget.source} />
                </div>
              </Card>
            ))}

            {/* Add Widget Button */}
            <button
              onClick={() => setIsAddingWidget(true)}
              className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 transition-colors min-h-[200px]"
            >
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Add Widget</span>
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedWidget && (
          <div className="w-64 border-l border-border bg-card p-4 overflow-y-auto hidden lg:block">
            <h3 className="text-xs font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Widget Properties</h3>
            {(() => {
              const widget = widgets.find(w => w.id === selectedWidget);
              if (!widget) return null;
              return (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Data Source</label>
                    <select
                      value={widget.source}
                      onChange={(e) => updateWidget(widget.id, { source: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                    >
                      {dataSources.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Size</label>
                    <div className="flex gap-2 mt-1">
                      {['sm', 'md', 'lg'].map(size => (
                        <button
                          key={size}
                          onClick={() => updateWidget(widget.id, { size: size as Widget['size'] })}
                          className={cn(
                            'flex-1 py-1.5 text-xs rounded-lg border transition-colors',
                            widget.size === size ? 'border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5]' : 'border-border text-muted-foreground hover:bg-muted'
                          )}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Widget
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}