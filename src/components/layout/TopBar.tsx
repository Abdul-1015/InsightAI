import React from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import type { Page } from "./Sidebar";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TopBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  currentPage: Page;
}

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  upload: "Upload Data",
  chat: "AI Chat",
  builder: "Dashboard Builder",
  insights: "Insights",
  reports: "Reports",
  projects: "Projects",
  settings: "Settings",
};

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  isDark,
  onToggleDark,
  currentPage,
}) => {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1
        className="text-sm font-semibold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {titles[currentPage] || ""}
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
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isDark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4F46E5] rounded-full" />
        </button>

        {user && (
          <div className="relative ml-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[10px] font-bold">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <span className="text-xs font-medium text-foreground hidden lg:block max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                  <a
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </a>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
