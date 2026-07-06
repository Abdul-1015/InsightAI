import React from 'react';
import {
  LayoutDashboard, Upload, MessageSquare, BarChart2, Lightbulb,
  FileText, FolderOpen, Settings, X, Sparkles, LogOut
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type Page =
  | 'landing' | 'signin' | 'signup'
  | 'dashboard' | 'upload' | 'chat' | 'builder'
  | 'insights' | 'reports' | 'projects' | 'settings';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'upload', label: 'Upload Data', icon: Upload, href: '/upload' },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare, href: '/chat' },
  { id: 'builder', label: 'Dashboard Builder', icon: BarChart2, href: '/builder' },
  { id: 'insights', label: 'Insights', icon: Lightbulb, href: '/insights' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '/projects' },
];

interface SidebarProps {
  currentPage: Page;
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, open, onClose }) => {
  const { user, signOut } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-60 bg-card border-r border-border z-40 flex flex-col transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border flex-shrink-0">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              InsightAI
            </span>
          </a>
          <button onClick={onClose} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          <div className="px-2 pb-2 pt-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Workspace</span>
          </div>
          {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => (
            <a
              key={id}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === id
                  ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </a>
          ))}

          <div className="px-2 pt-5 pb-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Account</span>
          </div>
          <a
            href="/settings"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              currentPage === 'settings'
                ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </nav>

        {user && (
          <div className="px-3 py-3 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer group transition-colors">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{user.name}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{user.provider}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  signOut();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <LogOut className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
