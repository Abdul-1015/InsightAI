import React from 'react';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import type { Page } from './Sidebar';

interface TopBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  currentPage: Page;
}

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  upload: 'Upload Data',
  chat: 'AI Chat',
  builder: 'Dashboard Builder',
  insights: 'Insights',
  reports: 'Reports',
  projects: 'Projects',
  settings: 'Settings',
};

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, isDark, onToggleDark, currentPage }) => {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3 flex-shrink-0">
      <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
        {titles[currentPage] || ''}
      </h1>

      <div className="flex-1 hidden md:flex items-center">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 ml-4 w-64 group">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search anything..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5 font-mono">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button onClick={onToggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4F46E5] rounded-full" />
        </button>
      </div>
    </header>
  );
};