import { useState } from 'react';
import { FolderOpen, Plus, Search, MoreHorizontal, Lightbulb, BarChart2, Archive, Share, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { projects } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type ProjectStatus = 'all' | 'active' | 'complete' | 'archived';

export function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500';
      case 'complete': return 'bg-[#4F46E5]/10 text-[#4F46E5]';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your data analysis into projects</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: FolderOpen },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, icon: BarChart2 },
          { label: 'Completed', value: projects.filter(p => p.status === 'complete').length, icon: Lightbulb },
          { label: 'Archived', value: projects.filter(p => p.status === 'archived').length, icon: Archive },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'active', 'complete', 'archived'] as ProjectStatus[]).map((status) => (
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

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project, i) => (
          <Card key={i} className="p-5 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
                  <FolderOpen className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{project.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge className={cn('text-[9px]', getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{project.lastActive}</span>
                  </div>
                </div>
              </div>
              <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{project.files}</div>
                <div className="text-[10px] text-muted-foreground">Files</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{project.queries}</div>
                <div className="text-[10px] text-muted-foreground">Queries</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{project.insights}</div>
                <div className="text-[10px] text-muted-foreground">Insights</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
                <BarChart2 className="w-3.5 h-3.5" /> Open
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Share className="w-3.5 h-3.5" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}

        {/* New Project Card */}
        <button className="border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center text-muted-foreground hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 transition-colors min-h-[220px]">
          <Plus className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Create New Project</span>
        </button>
      </div>
    </div>
  );
}