import { useState } from 'react';
import { FileText, Download, Share, Calendar, CheckCircle2, AlertCircle, Loader2, Plus, Search, MoreHorizontal, Eye, BarChart2, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { reports } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type ReportStatus = 'all' | 'ready' | 'processing' | 'draft';

export function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'draft': return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-emerald-500/10 text-emerald-500';
      case 'processing': return 'bg-amber-500/10 text-amber-500';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate, schedule, and export your data reports</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
          <Plus className="w-3.5 h-3.5" /> New Report
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
              <Sparkles className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>AI Report</h3>
              <p className="text-xs text-muted-foreground">Auto-generated insights</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
              <Calendar className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Schedule</h3>
              <p className="text-xs text-muted-foreground">Set up recurring reports</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
              <BarChart2 className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Templates</h3>
              <p className="text-xs text-muted-foreground">Pre-built report templates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'ready', 'processing', 'draft'] as ReportStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                statusFilter === status ? 'bg-[#4F46E5] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Report Name', 'Type', 'Created', 'Status', 'Size', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#4F46E5]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{report.name}</div>
                        <div className="text-[10px] text-muted-foreground">{report.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className="text-[9px]">{report.type}</Badge>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{report.created}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(report.status)}
                      <Badge className={cn('text-[9px]', getStatusColor(report.status))}>
                        {report.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{report.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Share className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReports.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No reports found</p>
          </div>
        )}
      </Card>
    </div>
  );
}