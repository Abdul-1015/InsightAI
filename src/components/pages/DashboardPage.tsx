import { useState } from 'react';
import { LayoutDashboard, Upload, MessageSquare, BarChart2, Lightbulb, FileText, FolderOpen, Settings, ChevronRight, ChevronDown, TrendingUp, TrendingDown, Sparkles, AlertTriangle, BarChart, PieChart, Activity, Eye, Clock, Target, ArrowRight, Zap, Users, DollarSign, ShoppingCart, Brain, Plus, Check, Copy, MoreHorizontal, Send, Paperclip, Bot, User, Shield, Globe, RefreshCw, FileDown, MoreVertical, Filter, Calendar, ArrowUpRight, Download, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 42000, profit: 18000, queries: 320 },
  { month: 'Feb', revenue: 58000, profit: 24000, queries: 480 },
  { month: 'Mar', revenue: 49000, profit: 21000, queries: 410 },
  { month: 'Apr', revenue: 72000, profit: 32000, queries: 620 },
  { month: 'May', revenue: 68000, profit: 29000, queries: 580 },
  { month: 'Jun', revenue: 95000, profit: 42000, queries: 820 },
  { month: 'Jul', revenue: 110000, profit: 48000, queries: 960 },
  { month: 'Aug', revenue: 125000, profit: 55000, queries: 1100 },
  { month: 'Sep', revenue: 108000, profit: 47000, queries: 940 },
  { month: 'Oct', revenue: 132000, profit: 58000, queries: 1240 },
  { month: 'Nov', revenue: 148000, profit: 65000, queries: 1380 },
  { month: 'Dec', revenue: 165000, profit: 72000, queries: 1520 },
];

const pieData: PieData[] = [
  { name: 'Enterprise', value: 42, color: '#4F46E5' },
  { name: 'Startup', value: 28, color: '#818CF8' },
  { name: 'Agency', value: 18, color: '#A5B4FC' },
  { name: 'Freelance', value: 12, color: '#C7D2FE' },
];

const weeklyData: WeeklyData[] = [
  { day: 'Mon', queries: 124 },
  { day: 'Tue', queries: 156 },
  { day: 'Wed', queries: 189 },
  { day: 'Thu', queries: 142 },
  { day: 'Fri', queries: 201 },
  { day: 'Sat', queries: 89 },
  { day: 'Sun', queries: 67 },
];

const forecastData: ForecastData[] = [
  { month: 'Jul', actual: 110000, predicted: 108000 },
  { month: 'Aug', actual: 125000, predicted: 122000 },
  { month: 'Sep', actual: 108000, predicted: 115000 },
  { month: 'Oct', actual: 132000, predicted: 128000 },
  { month: 'Nov', actual: 148000, predicted: 142000 },
  { month: 'Dec', actual: 165000, predicted: 158000 },
  { month: 'Jan', actual: 0, predicted: 172000 },
  { month: 'Feb', actual: 0, predicted: 185000 },
];

const products: ProductData[] = [
  { name: 'InsightAI Pro', category: 'SaaS', revenue: 42000, growth: 12.5, status: 'active' },
  { name: 'Data Connector', category: 'Integration', revenue: 28000, growth: 8.3, status: 'active' },
  { name: 'API Access', category: 'Developer', revenue: 15000, growth: -2.1, status: 'active' },
  { name: 'Custom Reports', category: 'Enterprise', revenue: 35000, growth: 15.7, status: 'active' },
  { name: 'Legacy Dashboard', category: 'Deprecated', revenue: 5000, growth: -18.2, status: 'inactive' },
];

const userGrowth: UserGrowthData[] = [
  { month: 'Jul', total: 1200, new: 180, churned: 32 },
  { month: 'Aug', total: 1348, new: 210, churned: 42 },
  { month: 'Sep', total: 1516, new: 245, churned: 37 },
  { month: 'Oct', total: 1724, new: 278, churned: 40 },
  { month: 'Nov', total: 1962, new: 312, churned: 38 },
  { month: 'Dec', total: 2234, new: 348, churned: 36 },
  { month: 'Jan', total: 2546, new: 392, churned: 44 },
  { month: 'Feb', total: 2898, new: 428, churned: 52 },
];

const reports: ReportData[] = [
  { id: '1', name: 'Q4 Revenue Analysis', type: 'revenue', date: '2024-01-15', status: 'ready', size: '2.4 MB' },
  { id: '2', name: 'Monthly Marketing Report', type: 'marketing', date: '2024-01-14', status: 'ready', size: '1.8 MB' },
  { id: '3', name: 'Customer Churn Analysis', type: 'customers', date: '2024-01-13', status: 'ready', size: '3.1 MB' },
  { id: '4', name: 'Product Usage Metrics', type: 'product', date: '2024-01-12', status: 'processing', size: '-' },
  { id: '5', name: 'Annual Sales Summary', type: 'revenue', date: '2024-01-11', status: 'ready', size: '4.2 MB' },
  { id: '6', name: 'Regional Performance', type: 'marketing', date: '2024-01-10', status: 'ready', size: '2.9 MB' },
];

const projects: ProjectData[] = [
  { id: '1', name: 'Q4 Analysis', files: 5, queries: 342, lastActive: '2 hours ago', status: 'active' },
  { id: '2', name: 'Marketing Campaign', files: 8, queries: 891, lastActive: '1 day ago', status: 'active' },
  { id: '3', name: 'Customer Insights', files: 3, queries: 156, lastActive: '3 days ago', status: 'active' },
  { id: '4', name: 'Product Metrics', files: 12, queries: 1204, lastActive: '1 week ago', status: 'archived' },
  { id: '5', name: 'Sales Pipeline', files: 4, queries: 89, lastActive: '2 weeks ago', status: 'archived' },
];

const anomalies: AnomalyData[] = [
  { id: '1', type: 'spike', metric: 'Page Views', value: '45,892', expected: '28,000', severity: 'high', date: 'Today' },
  { id: '2', type: 'drop', metric: 'Conversion Rate', value: '1.2%', expected: '3.8%', severity: 'critical', date: 'Today' },
  { id: '3', type: 'trend', metric: 'Bounce Rate', value: '62%', expected: '45%', severity: 'medium', date: 'Yesterday' },
  { id: '4', type: 'spike', metric: 'API Calls', value: '1.2M', expected: '800K', severity: 'low', date: 'Yesterday' },
];

const recommendations: RecommendationData[] = [
  { id: '1', title: 'Optimize Checkout Flow', impact: 'high', effort: 'medium', description: 'Users abandon cart at payment step. Consider adding guest checkout.' },
  { id: '2', title: 'Scale API Infrastructure', impact: 'high', effort: 'high', description: 'API calls increased 50% MoM. Plan for 2x capacity by Q2.' },
  { id: '3', title: 'Improve Mobile Experience', impact: 'medium', effort: 'low', description: 'Mobile conversion is 40% lower than desktop. Run A/B tests on mobile layout.' },
  { id: '4', title: 'Expand Enterprise Features', impact: 'high', effort: 'medium', description: 'Enterprise tier shows 12.5% growth. Add SSO and custom roles.' },
];

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
            <Plus className="w-3.5 h-3.5" /> New Query
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$1.24M', change: '+12.5%', up: true, icon: DollarSign },
          { label: 'Active Users', value: '8,421', change: '+8.3%', up: true, icon: Users },
          { label: 'Conversion Rate', value: '3.24%', change: '-0.4%', up: false, icon: Target },
          { label: 'AI Queries', value: '24.8K', change: '+23%', up: true, icon: Brain },
        ].map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
            <div className={cn('text-xs font-medium flex items-center gap-1 mt-1', up ? 'text-emerald-500' : 'text-red-500')}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change} vs last month
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insight Banner */}
      <Card className="p-4 bg-[#4F46E5]/5 border-[#4F46E5]/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#4F46E5]" style={{ fontFamily: 'var(--font-display)' }}>AI Insight</div>
            <p className="text-sm text-muted-foreground mt-1">Revenue grew 12.5% month-over-month. Enterprise tier drives 42% of ARR. Consider expanding enterprise features to capture more high-value customers.</p>
          </div>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue over time</p>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="h-48">
            <div className="h-full flex items-end gap-1">
              {revenueData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-[#4F46E5] rounded-t" style={{ height: `${(d.revenue / 165000) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>User Segments</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribution by plan type</p>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-[#4F46E5] relative">
              <div className="absolute inset-0 rounded-full border-8 border-[#818CF8] border-t-transparent border-r-transparent transform rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>2,898</div>
                  <div className="text-[10px] text-muted-foreground">Total Users</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Anomalies & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Anomalies Detected</h3>
            <Badge className="text-[10px]">{anomalies.length} Found</Badge>
          </div>
          <div className="space-y-2">
            {anomalies.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 bg-muted/50 rounded-lg">
                <AlertTriangle className={cn('w-4 h-4', a.severity === 'critical' ? 'text-red-500' : a.severity === 'high' ? 'text-amber-500' : 'text-blue-500')} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{a.metric}</div>
                  <div className="text-[10px] text-muted-foreground">{a.value} (expected: {a.expected})</div>
                </div>
                <Badge className={cn('text-[9px]', a.severity === 'critical' && 'bg-red-500/10 text-red-500', a.severity === 'high' && 'bg-amber-500/10 text-amber-500', a.severity === 'medium' && 'bg-blue-500/10 text-blue-500', a.severity === 'low' && 'bg-muted text-muted-foreground')}>
                  {a.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Recommendations</h3>
            <Badge className="text-[10px]">{recommendations.length} Actions</Badge>
          </div>
          <div className="space-y-2">
            {recommendations.map((r) => (
              <div key={r.id} className="p-2.5 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-foreground">{r.title}</div>
                  <Badge className={cn('text-[9px]', r.impact === 'high' && 'bg-emerald-500/10 text-emerald-500', r.impact === 'medium' && 'bg-amber-500/10 text-amber-500')}>
                    {r.impact} impact
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Product Performance</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-medium text-muted-foreground pb-2">Product</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground pb-2">Category</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground pb-2">Revenue</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground pb-2">Growth</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-xs font-medium text-foreground">{p.name}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{p.category}</td>
                  <td className="py-2.5 text-xs text-foreground text-right">${p.revenue.toLocaleString()}</td>
                  <td className={cn('py-2.5 text-xs text-right font-medium', p.growth >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                    {p.growth >= 0 ? '+' : ''}{p.growth}%
                  </td>
                  <td className="py-2.5">
                    <Badge className={cn('text-[9px]', p.status === 'active' && 'bg-emerald-500/10 text-emerald-500', p.status === 'inactive' && 'bg-muted text-muted-foreground')}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}