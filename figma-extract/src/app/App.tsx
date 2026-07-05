import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Upload, MessageSquare, BarChart2, Lightbulb,
  FileText, FolderOpen, Settings, ChevronRight, ChevronDown, ChevronUp,
  Search, Bell, Moon, Sun, X, Menu, ArrowRight, Check, TrendingUp,
  TrendingDown, AlertTriangle, Zap, Download, Share2, Filter, Calendar,
  Plus, MoreHorizontal, Sparkles, Brain, DollarSign, CreditCard, Send,
  FileSpreadsheet, Trash2, Eye, Clock, ArrowUpRight, Play, LogOut,
  Shield, Star, RefreshCw, Target, Globe, Layers
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, LineChart as ReLineChart,
  Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page =
  | "landing" | "signin" | "signup"
  | "dashboard" | "upload" | "chat" | "builder"
  | "insights" | "reports" | "projects" | "settings";

interface AppUser { name: string; email: string; plan: string; }

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 145, queries: 820 },
  { month: "Feb", revenue: 158, queries: 940 },
  { month: "Mar", revenue: 142, queries: 870 },
  { month: "Apr", revenue: 175, queries: 1100 },
  { month: "May", revenue: 168, queries: 1050 },
  { month: "Jun", revenue: 192, queries: 1240 },
  { month: "Jul", revenue: 205, queries: 1380 },
  { month: "Aug", revenue: 198, queries: 1290 },
  { month: "Sep", revenue: 215, queries: 1450 },
  { month: "Oct", revenue: 228, queries: 1580 },
  { month: "Nov", revenue: 242, queries: 1720 },
  { month: "Dec", revenue: 255, queries: 1890 },
];

const pieData = [
  { name: "Enterprise", value: 42, color: "#4F46E5" },
  { name: "Growth", value: 28, color: "#7C3AED" },
  { name: "Starter", value: 20, color: "#06B6D4" },
  { name: "Free", value: 10, color: "#94A3B8" },
];

const weeklyData = [
  { day: "Mon", uploads: 24, queries: 180 },
  { day: "Tue", uploads: 31, queries: 215 },
  { day: "Wed", uploads: 28, queries: 198 },
  { day: "Thu", uploads: 42, queries: 267 },
  { day: "Fri", uploads: 38, queries: 243 },
  { day: "Sat", uploads: 12, queries: 89 },
  { day: "Sun", uploads: 8, queries: 67 },
];

const forecastData = [
  { month: "Jan", actual: 145, forecast: null },
  { month: "Feb", actual: 158, forecast: null },
  { month: "Mar", actual: 142, forecast: null },
  { month: "Apr", actual: 175, forecast: null },
  { month: "May", actual: 168, forecast: null },
  { month: "Jun", actual: 192, forecast: null },
  { month: "Jul", actual: 205, forecast: null },
  { month: "Aug", actual: 198, forecast: null },
  { month: "Sep", actual: 215, forecast: null },
  { month: "Oct", actual: null, forecast: 235 },
  { month: "Nov", actual: null, forecast: 258 },
  { month: "Dec", actual: null, forecast: 278 },
];

const productData = [
  { name: "Enterprise Suite", revenue: 842 },
  { name: "Analytics Pro", revenue: 512 },
  { name: "Starter Pack", revenue: 287 },
  { name: "Team Plan", revenue: 198 },
  { name: "API Access", revenue: 143 },
];

const userGrowthData = revenueData.map((d, i) => ({
  month: d.month,
  users: 1200 + i * 165,
}));

// ─── Utilities ────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Base Components ──────────────────────────────────────────────────────────

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
}) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
    danger: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400",
    info: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400",
    purple: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2";
  const variants = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-[0.98] shadow-sm",
    secondary:
      "bg-transparent border border-border text-foreground hover:bg-muted active:scale-[0.98]",
    ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
    icon: "w-8 h-8 text-sm",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border rounded-xl", className)}>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="font-semibold text-foreground mb-1.5">{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground py-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span>
            {entry.name}:{" "}
            <span className="text-foreground font-medium">{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Data", icon: Upload },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "builder", label: "Dashboard Builder", icon: BarChart2 },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "projects", label: "Projects", icon: FolderOpen },
];

function Sidebar({
  page,
  onNavigate,
  onLogout,
  open,
  onClose,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-card border-r border-border z-40 flex flex-col",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="font-bold text-foreground text-sm tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            InsightAI
          </span>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          <div className="px-2 pb-2 pt-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Workspace
            </span>
          </div>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onNavigate(id as Page);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                page === id
                  ? "bg-[#4F46E5]/10 text-[#4F46E5] font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}

          <div className="px-2 pt-5 pb-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Account
            </span>
          </div>
          <button
            onClick={() => {
              onNavigate("settings");
              onClose();
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
              page === "settings"
                ? "bg-[#4F46E5]/10 text-[#4F46E5] font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted cursor-pointer group transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              SR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                Sarah Reynolds
              </div>
              <div className="text-[10px] text-muted-foreground">Pro Plan</div>
            </div>
            <button
              onClick={onLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({
  onMenuClick,
  isDark,
  onToggleDark,
  page,
}: {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  page: Page;
}) {
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
        {titles[page] || ""}
      </h1>

      <div className="flex-1 hidden md:flex items-center">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 ml-4 w-64 group">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search anything…"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4F46E5] rounded-full" />
        </button>
      </div>
    </header>
  );
}

// ─── Landing: Product Preview ─────────────────────────────────────────────────

function ProductPreview() {
  return (
    <div className="relative">
      <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-muted rounded px-3 py-0.5 text-[10px] text-muted-foreground w-44 text-center font-mono">
              app.insightai.com/dashboard
            </div>
          </div>
        </div>

        <div className="flex h-[280px]">
          {/* Mini sidebar */}
          <div className="w-28 border-r border-border flex flex-col flex-shrink-0 bg-card">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border">
              <div className="w-4 h-4 rounded bg-[#4F46E5] flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[9px] font-bold text-foreground">InsightAI</span>
            </div>
            <div className="p-2 space-y-0.5">
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: MessageSquare, label: "AI Chat", active: false },
                { icon: BarChart2, label: "Builder", active: false },
                { icon: Lightbulb, label: "Insights", active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded text-[8px] font-medium",
                    active
                      ? "bg-[#4F46E5]/12 text-[#4F46E5]"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 overflow-hidden flex flex-col bg-background">
            <div className="h-8 border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
              <span className="text-[9px] font-semibold text-foreground">Dashboard</span>
              <div className="ml-auto flex gap-1">
                <div className="w-12 h-4 rounded bg-muted" />
                <div className="w-14 h-4 rounded bg-[#4F46E5]" />
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-1.5 p-2 flex-shrink-0">
              {[
                { label: "Revenue", value: "$2.4M", up: true, pct: "+12.5%" },
                { label: "Queries", value: "1,247", up: true, pct: "+8.3%" },
                { label: "Insights", value: "89", up: true, pct: "+23%" },
              ].map(({ label, value, up, pct }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-lg p-2"
                >
                  <div className="text-[7px] text-muted-foreground mb-0.5">
                    {label}
                  </div>
                  <div className="text-[11px] font-bold text-foreground leading-tight">
                    {value}
                  </div>
                  <div
                    className={cn(
                      "text-[7px] flex items-center gap-0.5 font-medium mt-0.5",
                      up ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {up ? (
                      <TrendingUp className="w-2 h-2" />
                    ) : (
                      <TrendingDown className="w-2 h-2" />
                    )}
                    {pct}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div className="px-2 flex-1 min-h-0">
              <div className="bg-card border border-border rounded-lg p-2 h-full">
                <div className="text-[7px] font-medium text-muted-foreground mb-1">
                  Revenue Trend
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart
                    data={revenueData.slice(-8)}
                    margin={{ top: 0, right: 0, left: -35, bottom: -10 }}
                  >
                    <defs>
                      <linearGradient
                        id="miniGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4F46E5"
                      strokeWidth={1.5}
                      fill="url(#miniGrad)"
                      dot={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 5 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 5 }} tickLine={false} axisLine={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI insight strip */}
            <div className="p-2 flex-shrink-0">
              <div className="bg-[#4F46E5]/8 border border-[#4F46E5]/20 rounded-lg p-2 flex gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
                <div>
                  <div className="text-[7px] font-semibold text-[#4F46E5] mb-0.5">
                    AI Insight
                  </div>
                  <div className="text-[7px] text-muted-foreground leading-snug">
                    Revenue grew 12.5% MoM. Enterprise tier drives 42% of ARR.
                    Anomaly detected in Aug — investigate further.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -inset-4 bg-[#4F46E5]/8 blur-2xl rounded-3xl -z-10 pointer-events-none" />
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingNav({
  onNavigate,
  isDark,
  onToggleDark,
}: {
  onNavigate: (p: Page) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="font-bold text-foreground text-sm tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            InsightAI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground flex-1">
          {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("signin")}>
            Sign in
          </Btn>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("signup")}>
            Start Free
          </Btn>
          <button
            className="md:hidden ml-1 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
            <button
              key={item}
              className="block text-sm text-muted-foreground hover:text-foreground w-full text-left py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </button>
          ))}
          <div className="pt-3 flex gap-2">
            <Btn variant="secondary" size="sm" onClick={() => onNavigate("signin")} className="flex-1 justify-center">Sign in</Btn>
            <Btn variant="primary" size="sm" onClick={() => onNavigate("signup")} className="flex-1 justify-center">Start Free</Btn>
          </div>
        </div>
      )}
    </nav>
  );
}

function LandingPage({
  onNavigate,
  isDark,
  onToggleDark,
}: {
  onNavigate: (p: Page) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Sparkles,
      title: "Natural Language Queries",
      desc: "Ask questions in plain English. No SQL, no formulas, no BI expertise needed. Just type and get answers.",
    },
    {
      icon: BarChart2,
      title: "Auto-Generated Dashboards",
      desc: "AI understands your schema, detects relationships, and builds beautiful dashboards automatically.",
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      desc: "Spot outliers, irregularities, and patterns your team would otherwise miss buried in rows of data.",
    },
    {
      icon: Layers,
      title: "Multi-file Analysis",
      desc: "Upload multiple Excel, CSV, or Sheets files. Analyze them together, join on shared columns automatically.",
    },
    {
      icon: Download,
      title: "Export & Share",
      desc: "Export dashboards to PDF, Excel, or PowerPoint. Share a live link with your team or schedule delivery.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "SOC 2 Type II certified. Data encrypted in transit and at rest. Your data never trains our models.",
    },
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Head of Analytics, Stripe",
      quote:
        "We replaced three separate BI tools with InsightAI. Our analysts now spend time on strategy, not building dashboards.",
      initials: "MC",
    },
    {
      name: "Priya Sharma",
      role: "VP Operations, Notion",
      quote:
        "The natural language queries are genuinely magical. I asked for our churn analysis and got a complete dashboard in seconds.",
      initials: "PS",
    },
    {
      name: "Tom Lindberg",
      role: "CEO, Linear",
      quote:
        "InsightAI makes data accessible to every team member. PMs now run their own analyses without waiting on data engineering.",
      initials: "TL",
    },
  ];

  const faqs = [
    {
      q: "What file formats are supported?",
      a: "InsightAI supports Excel (.xlsx, .xls), CSV, TSV, Google Sheets exports, and JSON. You can upload multiple files and analyze them together in a single project.",
    },
    {
      q: "How does the AI analyze my data?",
      a: "Our AI automatically detects column types, relationships, and patterns in your data, then generates relevant charts, KPIs, and insights based on what it finds — no configuration needed.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. We are SOC 2 Type II certified. Data is encrypted in transit and at rest using AES-256. We never use your data to train AI models and never share it with third parties.",
    },
    {
      q: "Can I schedule automated reports?",
      a: "Pro and Enterprise plans support scheduled report generation and delivery by email. Reports can be configured to send daily, weekly, or monthly to any recipients.",
    },
    {
      q: "What happens if I exceed my query limit?",
      a: "We notify you at 80% usage. You can upgrade anytime, or purchase additional query packs without changing your plan. We never cut off access mid-month.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav
        onNavigate={onNavigate}
        isDark={isDark}
        onToggleDark={onToggleDark}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4F46E5]/8 border border-[#4F46E5]/20 text-[#4F46E5] text-xs font-medium px-3 py-1.5 rounded-full mb-8">
              <Sparkles className="w-3 h-3" />
              Now powered by GPT-4o
            </div>
            <h1
              className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.08] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Upload.
              <br />
              Ask.
              <br />
              <span className="text-[#4F46E5]">Analyze.</span>
            </h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Turn spreadsheets into dashboards and actionable insights using
              AI. No SQL. No Power BI expertise. No formulas. Just upload your
              files and ask questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn
                variant="primary"
                size="lg"
                onClick={() => onNavigate("signup")}
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Btn>
              <Btn variant="secondary" size="lg">
                <Play className="w-4 h-4" /> Watch Demo
              </Btn>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50,000+", label: "Analysts worldwide" },
            { value: "2.4M+", label: "Dashboards created" },
            { value: "< 30s", label: "Average time-to-insight" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                className="text-3xl font-extrabold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </div>
              <div className="text-sm text-muted-foreground mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge variant="default">Features</Badge>
          <h2
            className="mt-4 text-4xl font-extrabold text-foreground mt-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need to understand your data
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
            Built for data teams. Designed for everyone.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="p-6 hover:border-[#4F46E5]/30 transition-colors group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-5 group-hover:bg-[#4F46E5]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h3
                className="font-semibold text-foreground mb-2 text-[15px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-muted/40 border-y border-border py-28"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="default">How it works</Badge>
            <h2
              className="mt-5 text-4xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From raw data to board-ready insights in minutes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload your files",
                desc: "Drag and drop Excel, CSV, or Google Sheets files. Connect multiple data sources and let InsightAI understand your schema automatically. No setup.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Ask in plain English",
                desc: "Type questions like 'What was our best month?' or 'Show me sales by region.' No SQL. No filters. No training required — just type.",
              },
              {
                step: "03",
                icon: BarChart2,
                title: "Get instant insights",
                desc: "AI generates charts, KPIs, anomaly reports, and forecasts. Export to PDF, share with your team, or schedule weekly digests automatically.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step}>
                <div
                  className="text-7xl font-extrabold text-muted/50 mb-3 leading-none select-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3
                  className="font-semibold text-foreground text-lg mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge variant="default">Pricing</Badge>
          <h2
            className="mt-5 text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Scale as your team grows.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: "Free",
              price: "$0",
              period: "/month",
              desc: "Perfect for personal projects and exploration",
              features: [
                "5 file uploads / month",
                "100 AI queries / month",
                "3 dashboards",
                "CSV & Excel support",
                "Email export",
                "Community support",
              ],
              cta: "Get Started Free",
              featured: false,
            },
            {
              name: "Pro",
              price: "$29",
              period: "/month",
              desc: "For analysts and growing teams",
              features: [
                "Unlimited uploads",
                "2,000 AI queries / month",
                "Unlimited dashboards",
                "All file formats",
                "PDF, Excel & PPT export",
                "Scheduled reports",
                "Priority support",
              ],
              cta: "Start Pro Trial",
              featured: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              desc: "For large organizations with complex needs",
              features: [
                "Unlimited everything",
                "SSO & SAML",
                "SOC 2 compliance",
                "Custom AI models",
                "Dedicated account manager",
                "SLA guarantee",
                "On-premise deployment",
              ],
              cta: "Contact Sales",
              featured: false,
            },
          ].map(({ name, price, period, desc, features, cta, featured }) => (
            <Card
              key={name}
              className={cn(
                "p-6 flex flex-col",
                featured && "border-[#4F46E5] ring-1 ring-[#4F46E5] shadow-lg"
              )}
            >
              {featured && (
                <div className="mb-4">
                  <Badge variant="info">Most Popular</Badge>
                </div>
              )}
              <div
                className="text-sm font-bold text-foreground mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </div>
              <div className="mb-1.5 flex items-baseline gap-0.5">
                <span
                  className="text-3xl font-extrabold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {price}
                </span>
                <span className="text-muted-foreground text-sm">{period}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-6">{desc}</div>
              <div className="space-y-2.5 flex-1 mb-6">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
              <Btn
                variant={featured ? "primary" : "secondary"}
                onClick={() => onNavigate("signup")}
                className="w-full justify-center"
              >
                {cta}
              </Btn>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 border-y border-border py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="default">Testimonials</Badge>
            <h2
              className="mt-5 text-4xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trusted by data teams at world-class companies
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, initials }) => (
              <Card key={name} className="p-6">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {name}
                    </div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-28">
        <div className="text-center mb-14">
          <Badge variant="default">FAQ</Badge>
          <h2
            className="mt-5 text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {q}
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="bg-[#4F46E5] rounded-2xl p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative">
            <h2
              className="text-3xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start analyzing your data today
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">
              Join 50,000+ analysts already using InsightAI
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Btn
                variant="secondary"
                size="lg"
                onClick={() => onNavigate("signup")}
                className="bg-white text-[#4F46E5] border-white hover:bg-white/90 shadow-lg"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Btn>
              <Btn
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Talk to sales
              </Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span
                className="font-bold text-foreground text-sm"
                style={{ fontFamily: "var(--font-display)" }}
              >
                InsightAI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered business intelligence for modern data teams. From
              spreadsheet to insight in seconds.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Roadmap"],
            },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Status"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div className="text-xs font-semibold text-foreground mb-4 uppercase tracking-widest">
                {title}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2025 InsightAI, Inc. All rights reserved.</span>
            <span>Designed for data people who move fast.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────

function AuthPage({
  mode,
  onNavigate,
  onLogin,
  isDark,
  onToggleDark,
}: {
  mode: "signin" | "signup";
  onNavigate: (p: Page) => void;
  onLogin: (user: AppUser) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || "Sarah Reynolds",
      email: email || "sarah@acmecorp.com",
      plan: "Pro",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 h-14 border-b border-border">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="font-bold text-foreground text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            InsightAI
          </span>
        </button>
        <button
          onClick={onToggleDark}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "signin"
                ? "Sign in to your InsightAI workspace"
                : "Start analyzing your data in minutes — free forever"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Reynolds"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@acmecorp.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-xs text-[#4F46E5] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              />
            </div>
            <Btn
              variant="primary"
              size="lg"
              type="submit"
              className="w-full justify-center mt-2"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </Btn>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Microsoft"].map((provider) => (
              <button
                key={provider}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-7">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                onNavigate(mode === "signin" ? "signup" : "signin")
              }
              className="text-[#4F46E5] hover:underline font-medium"
            >
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────

function DashboardHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const kpis = [
    {
      label: "Total Revenue",
      value: "$2.42M",
      change: "+12.5%",
      icon: DollarSign,
      positive: true,
    },
    {
      label: "AI Queries",
      value: "1,247",
      change: "+8.3%",
      icon: MessageSquare,
      positive: true,
    },
    {
      label: "Insights Generated",
      value: "89",
      change: "+23.1%",
      icon: Lightbulb,
      positive: true,
    },
    {
      label: "Files Uploaded",
      value: "34",
      change: "-2.4%",
      icon: FileSpreadsheet,
      positive: false,
    },
  ];

  const recentProjects = [
    { name: "Q4 Sales Analysis", files: 3, updated: "2 hours ago", status: "active" },
    { name: "Customer Churn Study", files: 2, updated: "Yesterday", status: "complete" },
    { name: "Marketing ROI 2024", files: 5, updated: "3 days ago", status: "active" },
    { name: "Inventory Forecast Q1", files: 1, updated: "1 week ago", status: "complete" },
  ];

  const suggestions = [
    "What were our top 5 products by revenue last quarter?",
    "Show me customer acquisition trends by channel",
    "Identify anomalies in our monthly expenses",
    "Forecast next quarter revenue based on current trends",
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Good morning, Sarah 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here is what&apos;s happening with your data today.
          </p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" onClick={() => onNavigate("upload")}>
            <Upload className="w-3.5 h-3.5" /> Upload Data
          </Btn>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("chat")}>
            <Sparkles className="w-3.5 h-3.5" /> Ask AI
          </Btn>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon, positive }) => (
          <Card
            key={label}
            className="p-5 hover:border-[#4F46E5]/25 transition-colors cursor-default"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div
              className="text-2xl font-bold text-foreground mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                positive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change} vs last month
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Revenue Overview
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full year · monthly
              </p>
            </div>
            <Btn variant="ghost" size="sm">
              <Filter className="w-3.5 h-3.5" /> Filter
            </Btn>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}K`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($K)"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Revenue by Plan
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current period
            </p>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">{name}</span>
                </div>
                <span className="font-semibold text-foreground">{value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Projects + Suggestions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Projects
            </h3>
            <button
              onClick={() => onNavigate("projects")}
              className="text-xs text-[#4F46E5] hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {recentProjects.map(({ name, files, updated, status }) => (
              <div
                key={name}
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {files} files · {updated}
                  </div>
                </div>
                <Badge variant={status === "active" ? "info" : "success"}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Suggested Questions
            </h3>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onNavigate("chat")}
                className="w-full text-left text-xs text-muted-foreground bg-muted/60 hover:bg-muted hover:text-foreground rounded-lg p-3 transition-colors leading-relaxed text-[11px]"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Upload Page ──────────────────────────────────────────────────────────────

function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const files = [
    { name: "sales_q4_2024.xlsx", size: "2.4 MB", status: "complete", rows: 12450, cols: 18 },
    { name: "customer_data.csv", size: "890 KB", status: "complete", rows: 8200, cols: 12 },
    { name: "marketing_spend.xlsx", size: "1.1 MB", status: "uploading", rows: null, cols: null },
  ];

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Upload Data
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload spreadsheet files to start your AI analysis
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        className={cn(
          "border-2 border-dashed rounded-xl p-14 text-center transition-all cursor-pointer",
          dragging
            ? "border-[#4F46E5] bg-[#4F46E5]/5"
            : "border-border hover:border-[#4F46E5]/40 hover:bg-muted/30"
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3
          className="font-semibold text-foreground mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Drop files here to upload
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          or browse your computer
        </p>
        <Btn variant="primary" size="md">
          Browse Files
        </Btn>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          {["Excel (.xlsx)", "CSV", "Google Sheets", "JSON"].map((fmt) => (
            <div
              key={fmt}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Check className="w-3 h-3 text-emerald-500" />
              {fmt}
            </div>
          ))}
        </div>
      </div>

      {/* File list */}
      <Card className="divide-y divide-border overflow-hidden">
        <div className="px-5 py-3.5 flex items-center justify-between bg-muted/30">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Uploaded Files
          </h3>
          <span className="text-xs text-muted-foreground">{files.length} files</span>
        </div>
        {files.map(({ name, size, status, rows, cols }) => (
          <div key={name} className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {size}
                {rows && ` · ${rows.toLocaleString()} rows · ${cols} columns`}
              </div>
              {status === "uploading" && (
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden w-48">
                  <div className="h-full bg-[#4F46E5] rounded-full animate-pulse w-2/3" />
                </div>
              )}
            </div>
            <Badge variant={status === "complete" ? "success" : "info"}>
              {status}
            </Badge>
            <div className="flex gap-1">
              <Btn variant="ghost" size="icon">
                <Eye className="w-3.5 h-3.5" />
              </Btn>
              <Btn variant="ghost" size="icon">
                <Trash2 className="w-3.5 h-3.5" />
              </Btn>
            </div>
          </div>
        ))}
      </Card>

      {/* Storage usage */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Storage Usage</span>
          <span className="text-sm text-muted-foreground">4.4 MB / 10 GB</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4F46E5] rounded-full"
            style={{ width: "0.044%" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          9.9 GB remaining on Pro plan
        </p>
      </Card>
    </div>
  );
}

// ─── AI Chat Page ─────────────────────────────────────────────────────────────

const chatHistory = [
  { id: "1", title: "Q4 Sales Analysis", date: "Today" },
  { id: "2", title: "Customer Churn Patterns", date: "Yesterday" },
  { id: "3", title: "Marketing ROI Breakdown", date: "Dec 18" },
  { id: "4", title: "Inventory Forecast Q1", date: "Dec 15" },
];

interface ChatMsg {
  role: "user" | "ai";
  content: string;
  hasChart?: boolean;
}

const initialMessages: ChatMsg[] = [
  {
    role: "user",
    content: "What were our top performing products by revenue last quarter?",
  },
  {
    role: "ai",
    content:
      "Based on your Q4 sales data, here are your top 5 products by revenue. **Enterprise Suite** led with $842K (34% of total), followed by **Analytics Pro** at $512K. Combined, these two account for over half of quarterly revenue. The bottom two products — Team Plan and API Access — are underindexed relative to their user count.",
    hasChart: true,
  },
  {
    role: "user",
    content: "Are there any anomalies I should be aware of?",
  },
  {
    role: "ai",
    content:
      "I detected **3 significant anomalies** in your data:\n\n**1. Revenue spike on Nov 14** — 340% above daily average. Correlates directly with your Black Friday campaign launch. This is a positive anomaly.\n\n**2. APAC underperformance in Oct** — Region came in 28% below forecast before recovering strongly in November. Worth investigating root cause.\n\n**3. Support ticket gap in Dec W3** — 60% drop in ticket volume. Possible data collection issue rather than a true drop in support demand.",
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [activeConv, setActiveConv] = useState("1");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiMsg: ChatMsg = {
        role: "ai",
        content:
          "I analyzed your query against the uploaded datasets. The data shows a consistent growth trajectory with seasonal variations aligning with industry benchmarks. **Revenue momentum** remains strong into Q1 — the trailing 3-month CAGR sits at 18.4%, above your 15% target. I would recommend focusing on the APAC recovery and the Enterprise pipeline for the next planning cycle.",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split("**").map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Conversation list */}
      <div className="hidden md:flex w-56 border-r border-border flex-col bg-card flex-shrink-0">
        <div className="p-3 border-b border-border">
          <Btn variant="primary" size="sm" className="w-full justify-center">
            <Plus className="w-3.5 h-3.5" /> New conversation
          </Btn>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-2.5">
            Recent
          </div>
          {chatHistory.map(({ id, title, date }) => (
            <button
              key={id}
              onClick={() => setActiveConv(id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors",
                activeConv === id
                  ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="font-medium truncate text-[13px]">{title}</div>
              <div className="text-[10px] mt-0.5 opacity-60">{date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 max-w-3xl",
                msg.role === "user" && "ml-auto flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5",
                  msg.role === "ai"
                    ? "bg-[#4F46E5] text-white"
                    : "bg-muted text-foreground border border-border"
                )}
              >
                {msg.role === "ai" ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  "SR"
                )}
              </div>

              <div className={cn("space-y-3", msg.role === "user" && "items-end")}>
                <div
                  className={cn(
                    "px-4 py-3 text-sm leading-relaxed rounded-2xl",
                    msg.role === "ai"
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-[#4F46E5] text-white rounded-tr-sm"
                  )}
                >
                  {formatContent(msg.content)}
                </div>

                {msg.hasChart && (
                  <Card className="p-4">
                    <div className="text-xs font-semibold text-foreground mb-3">
                      Top Products — Q4 Revenue ($K)
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={productData}
                          layout="vertical"
                          margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border)"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            tick={{
                              fontSize: 10,
                              fill: "var(--muted-foreground)",
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v}K`}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            tick={{
                              fontSize: 10,
                              fill: "var(--muted-foreground)",
                            }}
                            tickLine={false}
                            axisLine={false}
                            width={96}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar
                            dataKey="revenue"
                            name="Revenue ($K)"
                            fill="#4F46E5"
                            radius={[0, 4, 4, 0]}
                          />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <Btn variant="secondary" size="sm">
                        <Download className="w-3 h-3" /> Export
                      </Btn>
                      <Btn variant="secondary" size="sm">
                        <Share2 className="w-3 h-3" /> Share
                      </Btn>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggested prompts */}
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto">
          {[
            "Show trends over time",
            "Find outliers",
            "Compare by region",
            "Forecast next quarter",
            "Top customers by LTV",
          ].map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="flex-shrink-0 text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything about your data…"
                rows={1}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none transition-all"
              />
            </div>
            <Btn
              variant="primary"
              size="md"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="h-11 px-4 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Btn>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            AI can make mistakes. Always verify important data before sharing externally.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Builder ────────────────────────────────────────────────────────

function DashboardBuilder() {
  const [dateRange, setDateRange] = useState("Last 30 days");

  return (
    <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dashboard Builder
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-generated charts from your uploaded data
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-background">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-sm text-foreground focus:outline-none"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <Btn variant="secondary" size="sm">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Btn>
          <Btn variant="primary" size="sm">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Btn>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg. Revenue / Month", value: "$201K", up: true, change: "+8.2%" },
          { label: "Peak Query Day", value: "1,890", up: true, change: "Dec 28" },
          { label: "Avg. AI Response", value: "1.4s", up: false, change: "-12% faster" },
          { label: "Data Freshness", value: "< 5 min", up: true, change: "Live" },
        ].map(({ label, value, up, change }) => (
          <Card key={label} className="px-4 py-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div
              className="text-xl font-bold text-foreground mt-0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </div>
            <div
              className={cn(
                "text-xs font-medium flex items-center gap-0.5 mt-0.5",
                up
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              )}
            >
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          </Card>
        ))}
      </div>

      {/* Chart grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Revenue Trend</h3>
            <p className="text-xs text-muted-foreground">Monthly · $K</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4F46E5" strokeWidth={2} fill="url(#bg1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar chart */}
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Query Volume</h3>
            <p className="text-xs text-muted-foreground">Daily by weekday</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="queries" name="Queries" fill="#7C3AED" radius={[3, 3, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie chart */}
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Plan Distribution</h3>
            <p className="text-xs text-muted-foreground">% of revenue</p>
          </div>
          <div className="h-40 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={55} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line chart */}
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>User Growth</h3>
            <p className="text-xs text-muted-foreground">Cumulative monthly</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="users" name="Users" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Upload activity */}
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Upload Activity</h3>
            <p className="text-xs text-muted-foreground">Files per weekday</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="uploads" name="Uploads" fill="#10B981" radius={[3, 3, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Forecast */}
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Revenue Forecast</h3>
              <p className="text-xs text-muted-foreground">Q4 AI projection</p>
            </div>
            <Badge variant="purple">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </Badge>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#4F46E5" strokeWidth={2} fill="url(#fg1)" dot={false} />
                <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 3" fill="url(#fg2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Insights Page ────────────────────────────────────────────────────────────

function InsightsPage() {
  const anomalies = [
    {
      severity: "positive",
      title: "Revenue spike — Nov 14",
      desc: "340% above daily average. Driven by Black Friday campaign launch. Positive signal for seasonal strategy.",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60",
      badge: "success" as const,
    },
    {
      severity: "medium",
      title: "APAC underperformance — Oct",
      desc: "28% below forecast in October. Region recovered strongly in November. One-time event likely.",
      icon: TrendingDown,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60",
      badge: "warning" as const,
    },
    {
      severity: "investigate",
      title: "Support ticket data gap — Dec W3",
      desc: "60% volume drop in week 3 of December. Possible data collection failure rather than genuine drop.",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/60",
      badge: "danger" as const,
    },
  ];

  const recommendations = [
    {
      icon: Target,
      title: "Double down on Enterprise tier",
      desc: "42% of revenue from 8% of customers. Increasing Enterprise penetration by 5% adds ~$800K ARR.",
      priority: "High",
    },
    {
      icon: Globe,
      title: "Expand APAC operations",
      desc: "Post-October recovery shows resilience. Forecast projects 35% APAC growth potential in H1 2025.",
      priority: "Medium",
    },
    {
      icon: Zap,
      title: "Automate monthly reporting",
      desc: "Scheduled AI reports could save 40 analyst-hours per month across the team.",
      priority: "Low",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generated from Q4 2024 data · Updated 2 hours ago
          </p>
        </div>
        <Btn variant="secondary" size="sm">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analysis
        </Btn>
      </div>

      {/* AI Summary */}
      <Card className="p-6 border-[#4F46E5]/25 bg-[#4F46E5]/5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3
                className="font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Executive Summary
              </h3>
              <Badge variant="info">
                <Sparkles className="w-2.5 h-2.5" /> AI Generated
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Q4 2024 performance shows strong momentum with{" "}
              <strong className="text-foreground">
                $2.42M total revenue (+12.5% MoM)
              </strong>
              . The Enterprise tier drives 42% of revenue despite representing
              only 8% of customers, signaling excellent product-market fit in
              the enterprise segment. Three anomalies were detected — two are
              positive indicators. The APAC recovery in November suggests the
              October dip was an isolated event. Key opportunity: increasing
              Enterprise tier penetration could yield{" "}
              <strong className="text-foreground">
                ~$800K additional ARR in Q1 2025
              </strong>
              .
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Anomalies */}
        <div>
          <h3
            className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Detected
            Anomalies
          </h3>
          <div className="space-y-3">
            {anomalies.map(({ title, desc, icon: Icon, color, bg, badge }) => (
              <Card key={title} className="p-4 flex gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {title}
                    </span>
                    <Badge variant={badge}>{badge === "success" ? "positive" : badge === "warning" ? "medium" : "investigate"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3
            className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Sparkles className="w-4 h-4 text-[#4F46E5]" /> AI Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map(({ icon: Icon, title, desc, priority }) => (
              <Card
                key={title}
                className="p-4 flex gap-3 hover:border-[#4F46E5]/30 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {title}
                    </span>
                    <Badge
                      variant={
                        priority === "High"
                          ? "danger"
                          : priority === "Medium"
                          ? "warning"
                          : "default"
                      }
                    >
                      {priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Revenue Forecast — Q4 2024 → Q1 2025
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI projection based on trailing 12-month trend · confidence 87%
            </p>
          </div>
          <Badge variant="purple">
            <Sparkles className="w-2.5 h-2.5" /> Projected +15.2%
          </Badge>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="ifg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ifg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}K`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="actual" name="Actual ($K)" stroke="#4F46E5" strokeWidth={2} fill="url(#ifg1)" dot={false} />
              <Area type="monotone" dataKey="forecast" name="Forecast ($K)" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 3" fill="url(#ifg2)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const reports = [
    { name: "Q4 2024 Executive Summary", type: "AI Generated", created: "Dec 28, 2024", status: "ready", size: "2.4 MB" },
    { name: "Customer Churn Analysis", type: "Scheduled", created: "Dec 25, 2024", status: "ready", size: "1.8 MB" },
    { name: "Marketing ROI Report", type: "Manual", created: "Dec 20, 2024", status: "ready", size: "3.1 MB" },
    { name: "Weekly Metrics — W50", type: "Scheduled", created: "Dec 16, 2024", status: "ready", size: "890 KB" },
    { name: "Annual Forecast 2025", type: "AI Generated", created: "Dec 10, 2024", status: "draft", size: "4.2 MB" },
    { name: "Board Presentation Q3", type: "Manual", created: "Oct 1, 2024", status: "ready", size: "6.8 MB" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reports
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Saved, scheduled, and exported reports
          </p>
        </div>
        <Btn variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Report
        </Btn>
      </div>

      <div className="flex gap-0 border-b border-border">
        {["All Reports", "Scheduled", "Drafts", "Archived"].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === i
                ? "border-[#4F46E5] text-[#4F46E5]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-3 bg-muted/30 grid grid-cols-12 gap-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-b border-border">
          <div className="col-span-5">Report Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Actions</div>
        </div>
        {reports.map(({ name, type, created, status, size }) => (
          <div
            key={name}
            className="px-5 py-4 grid grid-cols-12 gap-4 items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{name}</div>
                <div className="text-xs text-muted-foreground">{size}</div>
              </div>
            </div>
            <div className="col-span-2">
              <Badge
                variant={
                  type === "AI Generated"
                    ? "info"
                    : type === "Scheduled"
                    ? "purple"
                    : "default"
                }
              >
                {type}
              </Badge>
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {created}
            </div>
            <div className="col-span-1">
              <Badge variant={status === "ready" ? "success" : "warning"}>
                {status}
              </Badge>
            </div>
            <div className="col-span-2 flex gap-1">
              <Btn variant="ghost" size="icon">
                <Download className="w-3.5 h-3.5" />
              </Btn>
              <Btn variant="ghost" size="icon">
                <Share2 className="w-3.5 h-3.5" />
              </Btn>
              <Btn variant="ghost" size="icon">
                <Trash2 className="w-3.5 h-3.5" />
              </Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────

function ProjectsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");

  const projects = [
    { name: "Q4 Sales Analysis", files: 3, queries: 47, lastActive: "2 hours ago", status: "active", insights: 12 },
    { name: "Customer Churn Study", files: 2, queries: 31, lastActive: "Yesterday", status: "complete", insights: 8 },
    { name: "Marketing ROI 2024", files: 5, queries: 62, lastActive: "3 days ago", status: "active", insights: 19 },
    { name: "Inventory Forecast Q1", files: 1, queries: 15, lastActive: "1 week ago", status: "complete", insights: 5 },
    { name: "Competitor Analysis", files: 4, queries: 28, lastActive: "2 weeks ago", status: "archived", insights: 7 },
    { name: "HR Analytics Q3", files: 2, queries: 19, lastActive: "1 month ago", status: "archived", insights: 4 },
  ];

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} projects · {projects.filter((p) => p.status === "active").length} active
          </p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => onNavigate("upload")}>
          <Plus className="w-3.5 h-3.5" /> New Project
        </Btn>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <Btn variant="secondary" size="md">
          <Filter className="w-3.5 h-3.5" /> Filter
        </Btn>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ name, files, queries, lastActive, status, insights }) => (
          <Card
            key={name}
            className="p-5 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group"
            onClick={() => onNavigate("chat")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    status === "active"
                      ? "info"
                      : status === "complete"
                      ? "success"
                      : "default"
                  }
                >
                  {status}
                </Badge>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <h3
              className="font-semibold text-foreground mb-2 text-[15px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span>{files} files</span>
              <span>{queries} queries</span>
              <span>{insights} insights</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {lastActive}
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}

        <button
          onClick={() => onNavigate("upload")}
          className="border-2 border-dashed border-border rounded-xl p-5 hover:border-[#4F46E5]/40 hover:bg-muted/20 transition-all flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            New Project
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage({
  isDark,
  onToggleDark,
}: {
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "workspace", label: "Workspace" },
    { id: "billing", label: "Billing" },
    { id: "security", label: "Security" },
    { id: "api", label: "API Keys" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account, workspace, and preferences
        </p>
      </div>

      <div className="flex gap-0 border-b border-border mb-7 overflow-x-auto">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              activeTab === id
                ? "border-[#4F46E5] text-[#4F46E5]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="space-y-5">
          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Profile Information
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xl font-bold select-none">
                SR
              </div>
              <div>
                <Btn variant="secondary" size="sm">
                  Change Photo
                </Btn>
                <div className="text-xs text-muted-foreground mt-1.5">
                  JPG, PNG up to 5 MB
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "First name", value: "Sarah" },
                { label: "Last name", value: "Reynolds" },
                { label: "Email", value: "sarah@acmecorp.com" },
                { label: "Job title", value: "Head of Analytics" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {label}
                  </label>
                  <input
                    defaultValue={value}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <Btn variant="primary" size="sm">
                Save Changes
              </Btn>
            </div>
          </Card>

          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Dark mode</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Switch between light and dark themes
                </div>
              </div>
              <button
                onClick={onToggleDark}
                className={cn(
                  "relative w-10 h-6 rounded-full transition-colors flex-shrink-0",
                  isDark ? "bg-[#4F46E5]" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                    isDark && "translate-x-4"
                  )}
                />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Billing */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Current Plan
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Pro
                  </span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  $29 / month · Renews Jan 1, 2025
                </div>
              </div>
              <Btn variant="secondary" size="sm">
                Upgrade
              </Btn>
            </div>
            <div className="space-y-3">
              {[
                { label: "AI Queries", used: 1247, total: 2000, unit: "" },
                { label: "Storage", used: 4.4, total: 10240, unit: " MB" },
              ].map(({ label, used, total, unit }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-medium">
                      {used}{unit} / {total}{unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F46E5] rounded-full"
                      style={{ width: `${Math.min((used / total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Payment Method
            </h3>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  Visa ending in 4242
                </div>
                <div className="text-xs text-muted-foreground">
                  Expires 12/2026
                </div>
              </div>
              <Btn variant="ghost" size="sm">
                Update
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Change Password
            </h3>
            <div className="space-y-3">
              {["Current password", "New password", "Confirm new password"].map(
                (label) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      {label}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                )
              )}
              <div className="flex justify-end mt-2">
                <Btn variant="primary" size="sm">
                  Update Password
                </Btn>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Two-factor authentication
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Add an extra layer of security with TOTP or hardware keys.
                </p>
              </div>
              <Badge variant="warning">Not enabled</Badge>
            </div>
            <Btn variant="secondary" size="sm" className="mt-4">
              Enable 2FA
            </Btn>
          </Card>
          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Active Sessions
            </h3>
            <div className="space-y-3">
              {[
                { device: "MacBook Pro · Chrome", location: "San Francisco, CA", current: true },
                { device: "iPhone 15 · Safari", location: "San Francisco, CA", current: false },
              ].map(({ device, location, current }) => (
                <div key={device} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      {device}
                      {current && <Badge variant="success">Current</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{location}</div>
                  </div>
                  {!current && <Btn variant="ghost" size="sm">Revoke</Btn>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* API Keys */}
      {activeTab === "api" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                API Keys
              </h3>
              <Btn variant="primary" size="sm">
                <Plus className="w-3.5 h-3.5" /> Generate Key
              </Btn>
            </div>
            <div className="space-y-3">
              {[
                { name: "Production Key", key: "sk-live-••••••••••4a2b", created: "Dec 1, 2024", lastUsed: "2 hours ago" },
                { name: "Development Key", key: "sk-test-••••••••••8f3c", created: "Nov 15, 2024", lastUsed: "3 days ago" },
              ].map(({ name, key, created, lastUsed }) => (
                <div
                  key={name}
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-foreground">
                      {name}
                    </div>
                    <div className="flex gap-1">
                      <Btn variant="ghost" size="icon">
                        <Eye className="w-3.5 h-3.5" />
                      </Btn>
                      <Btn variant="ghost" size="icon">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Btn>
                    </div>
                  </div>
                  <div
                    className="font-mono text-xs text-muted-foreground bg-muted rounded px-2.5 py-1.5 mb-2"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {key}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {created} · Last used {lastUsed}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card className="p-5">
          <h3
            className="text-sm font-semibold text-foreground mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Notification Preferences
          </h3>
          <div className="space-y-0">
            {[
              { title: "Weekly digest", desc: "Summary of your data insights every Monday morning", enabled: true },
              { title: "Anomaly alerts", desc: "Immediate notification when AI detects unusual patterns", enabled: true },
              { title: "Report ready", desc: "Notification when scheduled reports are generated", enabled: false },
              { title: "Query limit warning", desc: "Alert at 80% of monthly query usage", enabled: true },
              { title: "Product updates", desc: "News about new features and improvements", enabled: false },
            ].map(({ title, desc, enabled }) => (
              <div
                key={title}
                className="flex items-start justify-between py-4 border-b border-border last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {desc}
                  </div>
                </div>
                <button
                  className={cn(
                    "relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-6",
                    enabled ? "bg-[#4F46E5]" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                      enabled && "translate-x-4"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Workspace */}
      {activeTab === "workspace" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3
              className="text-sm font-semibold text-foreground mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Workspace Settings
            </h3>
            <div className="space-y-4">
              {[
                { label: "Workspace name", value: "Acme Corp Analytics" },
                { label: "Workspace URL", value: "acme-corp.insightai.com" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {label}
                  </label>
                  <input
                    defaultValue={value}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Btn variant="primary" size="sm">
                  Save
                </Btn>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-red-200 dark:border-red-900">
            <h3
              className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Permanently delete your workspace and all associated data. This
              action cannot be undone.
            </p>
            <Btn variant="danger" size="sm">
              Delete Workspace
            </Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const navigate = (p: Page) => {
    const publicPages: Page[] = ["landing", "signin", "signup"];
    if (!user && !publicPages.includes(p)) {
      setPage("signin");
      return;
    }
    setPage(p);
    setSidebarOpen(false);
    if (!["chat"].includes(p)) {
      window.scrollTo(0, 0);
    }
  };

  const handleLogin = (u: AppUser) => {
    setUser(u);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("landing");
  };

  if (page === "landing") {
    return (
      <LandingPage
        onNavigate={navigate}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />
    );
  }

  if (page === "signin" || page === "signup") {
    return (
      <AuthPage
        mode={page}
        onNavigate={navigate}
        onLogin={handleLogin}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        page={page}
        onNavigate={navigate}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-60 overflow-hidden min-w-0">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          page={page}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          {page === "dashboard" && <DashboardHome onNavigate={navigate} />}
          {page === "upload" && <UploadPage />}
          {page === "chat" && <ChatPage />}
          {page === "builder" && <DashboardBuilder />}
          {page === "insights" && <InsightsPage />}
          {page === "reports" && <ReportsPage />}
          {page === "projects" && <ProjectsPage onNavigate={navigate} />}
          {page === "settings" && (
            <SettingsPage
              isDark={isDark}
              onToggleDark={() => setIsDark(!isDark)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
