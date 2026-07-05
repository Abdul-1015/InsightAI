import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Upload, MessageSquare, BarChart2, Lightbulb,
  FileText, FolderOpen, Settings, ChevronRight, ChevronDown, ChevronUp,
  Search, Moon, Sun, X, Menu, ArrowRight, Check, TrendingUp,
  TrendingDown, AlertTriangle, Zap, Download, Share2, Filter, Calendar,
  Plus, MoreHorizontal, Sparkles, Brain, DollarSign, CreditCard, Send,
  FileSpreadsheet, Trash2, Eye, Clock, ArrowUpRight, Play, LogOut,
  Shield, Star, RefreshCw, Target, Globe, Layers
} from 'lucide-react';
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, LineChart as ReLineChart,
  Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { ChartTooltip } from '../components/ui/ChartTooltip';
import { Sidebar, type Page } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { Footer } from '../components/layout/Footer';
import {
  revenueData, pieData, weeklyData, forecastData, productData,
  userGrowthData, reports, projects, anomalies, recommendations, chatMessages
} from '../data/mock';

interface AppUser { name: string; email: string; plan: string; }

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// ─── Landing Nav ─────────────────────────────────────────────────────────────

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
          <span className="font-bold text-foreground text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            InsightAI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground flex-1">
          {['Features', 'How it works', 'Pricing', 'FAQ'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('signin')}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('signup')}>Start Free</Button>
          <button className="md:hidden ml-1 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {['Features', 'How it works', 'Pricing', 'FAQ'].map((item) => (
            <button key={item} className="block text-sm text-muted-foreground hover:text-foreground w-full text-left py-2" onClick={() => setMobileOpen(false)}>
              {item}
            </button>
          ))}
          <div className="pt-3 flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('signin')} className="flex-1 justify-center">Sign in</Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('signup')} className="flex-1 justify-center">Start Free</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Product Preview ─────────────────────────────────────────────────────────

function ProductPreview() {
  return (
    <div className="relative">
      <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
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
          <div className="w-28 border-r border-border flex flex-col flex-shrink-0 bg-card">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border">
              <div className="w-4 h-4 rounded bg-[#4F46E5] flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[9px] font-bold text-foreground">InsightAI</span>
            </div>
            <div className="p-2 space-y-0.5">
              {[
                { icon: LayoutDashboard, label: 'Dashboard', active: true },
                { icon: MessageSquare, label: 'AI Chat', active: false },
                { icon: BarChart2, label: 'Builder', active: false },
                { icon: Lightbulb, label: 'Insights', active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div key={label} className={cn('flex items-center gap-1.5 px-2 py-1.5 rounded text-[8px] font-medium', active ? 'bg-[#4F46E5]/12 text-[#4F46E5]' : 'text-muted-foreground')}>
                  <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-background">
            <div className="h-8 border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
              <span className="text-[9px] font-semibold text-foreground">Dashboard</span>
              <div className="ml-auto flex gap-1">
                <div className="w-12 h-4 rounded bg-muted" />
                <div className="w-14 h-4 rounded bg-[#4F46E5]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-2 flex-shrink-0">
              {[
                { label: 'Revenue', value: '$2.4M', up: true, pct: '+12.5%' },
                { label: 'Queries', value: '1,247', up: true, pct: '+8.3%' },
                { label: 'Insights', value: '89', up: true, pct: '+23%' },
              ].map(({ label, value, up, pct }) => (
                <div key={label} className="bg-card border border-border rounded-lg p-2">
                  <div className="text-[7px] text-muted-foreground mb-0.5">{label}</div>
                  <div className="text-[11px] font-bold text-foreground leading-tight">{value}</div>
                  <div className={cn('text-[7px] flex items-center gap-0.5 font-medium mt-0.5', up ? 'text-emerald-500' : 'text-red-500')}>
                    {up ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                    {pct}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-2 flex-1 min-h-0">
              <div className="bg-card border border-border rounded-lg p-2 h-full">
                <div className="text-[7px] font-medium text-muted-foreground mb-1">Revenue Trend</div>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={revenueData.slice(-8)} margin={{ top: 0, right: 0, left: -35, bottom: -10 }}>
                    <defs>
                      <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={1.5} fill="url(#miniGrad)" dot={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 5 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 5 }} tickLine={false} axisLine={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-2 flex-shrink-0">
              <div className="bg-[#4F46E5]/8 border border-[#4F46E5]/20 rounded-lg p-2 flex gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
                <div>
                  <div className="text-[7px] font-semibold text-[#4F46E5] mb-0.5">AI Insight</div>
                  <div className="text-[7px] text-muted-foreground leading-snug">Revenue grew 12.5% MoM. Enterprise tier drives 42% of ARR.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-[#4F46E5]/8 blur-2xl rounded-3xl -z-10 pointer-events-none" />
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

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
    { icon: Sparkles, title: 'Natural Language Queries', desc: 'Ask questions in plain English. No SQL, no formulas, no BI expertise needed. Just type and get answers.' },
    { icon: BarChart2, title: 'Auto-Generated Dashboards', desc: 'AI understands your schema, detects relationships, and builds beautiful dashboards automatically.' },
    { icon: AlertTriangle, title: 'Anomaly Detection', desc: 'Spot outliers, irregularities, and patterns your team would otherwise miss buried in rows of data.' },
    { icon: Layers, title: 'Multi-file Analysis', desc: 'Upload multiple Excel, CSV, or Sheets files. Analyze them together, join on shared columns automatically.' },
    { icon: Download, title: 'Export & Share', desc: 'Export dashboards to PDF, Excel, or PowerPoint. Share a live link with your team or schedule delivery.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 Type II certified. Data encrypted in transit and at rest. Your data never trains our models.' },
  ];

  const testimonials = [
    { name: 'Marcus Chen', role: 'Head of Analytics, Stripe', quote: 'We replaced three separate BI tools with InsightAI. Our analysts now spend time on strategy, not building dashboards.', initials: 'MC' },
    { name: 'Priya Sharma', role: 'VP Operations, Notion', quote: 'The natural language queries are genuinely magical. I asked for our churn analysis and got a complete dashboard in seconds.', initials: 'PS' },
    { name: 'Tom Lindberg', role: 'CEO, Linear', quote: 'InsightAI makes data accessible to every team member. PMs now run their own analyses without waiting on data engineering.', initials: 'TL' },
  ];

  const faqs = [
    { q: 'What file formats are supported?', a: 'InsightAI supports Excel (.xlsx, .xls), CSV, TSV, Google Sheets exports, and JSON. You can upload multiple files and analyze them together in a single project.' },
    { q: 'How does the AI analyze my data?', a: 'Our AI automatically detects column types, relationships, and patterns in your data, then generates relevant charts, KPIs, and insights based on what it finds — no configuration needed.' },
    { q: 'Is my data secure?', a: 'Yes. We are SOC 2 Type II certified. Data is encrypted in transit and at rest using AES-256. We never use your data to train AI models and never share it with third parties.' },
    { q: 'Can I schedule automated reports?', a: 'Pro and Enterprise plans support scheduled report generation and delivery by email. Reports can be configured to send daily, weekly, or monthly to any recipients.' },
    { q: 'What happens if I exceed my query limit?', a: 'We notify you at 80% usage. You can upgrade anytime, or purchase additional query packs without changing your plan. We never cut off access mid-month.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav onNavigate={onNavigate} isDark={isDark} onToggleDark={onToggleDark} />

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4F46E5]/8 border border-[#4F46E5]/20 text-[#4F46E5] text-xs font-medium px-3 py-1.5 rounded-full mb-8">
              <Sparkles className="w-3 h-3" />
              Now powered by GPT-4o
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.08] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Upload.<br />Ask.<br /><span className="text-[#4F46E5]">Analyze.</span>
            </h1>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Turn spreadsheets into dashboards and actionable insights using AI. No SQL. No Power BI expertise. No formulas. Just upload your files and ask questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" onClick={() => onNavigate('signup')}>
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg">
                <Play className="w-4 h-4" /> Watch Demo
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />No credit card required</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />14-day free trial</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />Cancel anytime</div>
            </div>
          </div>
          <div className="hidden lg:block">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50,000+', label: 'Analysts worldwide' },
            { value: '2.4M+', label: 'Dashboards created' },
            { value: '< 30s', label: 'Average time-to-insight' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
              <div className="text-sm text-muted-foreground mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge>Features</Badge>
          <h2 className="mt-4 text-4xl font-extrabold text-foreground mt-5" style={{ fontFamily: 'var(--font-display)' }}>
            Everything you need to understand your data
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">Built for data teams. Designed for everyone.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 hover:border-[#4F46E5]/30 transition-colors group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-5 group-hover:bg-[#4F46E5]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/40 border-y border-border py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge>How it works</Badge>
            <h2 className="mt-5 text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              From raw data to board-ready insights in minutes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: Upload, title: 'Upload your files', desc: 'Drag and drop Excel, CSV, or Google Sheets files. Connect multiple data sources and let InsightAI understand your schema automatically.' },
              { step: '02', icon: MessageSquare, title: 'Ask in plain English', desc: 'Type questions like "What was our best month?" or "Show me sales by region." No SQL. No filters. No training required.' },
              { step: '03', icon: BarChart2, title: 'Get instant insights', desc: 'AI generates charts, KPIs, anomaly reports, and forecasts. Export to PDF, share with your team, or schedule weekly digests.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step}>
                <div className="text-7xl font-extrabold text-muted/50 mb-3 leading-none select-none" style={{ fontFamily: 'var(--font-display)' }}>{step}</div>
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <Badge>Pricing</Badge>
          <h2 className="mt-5 text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground text-lg">Start free. Scale as your team grows.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Free', price: '$0', period: '/month', desc: 'Perfect for personal projects', features: ['5 file uploads / month', '100 AI queries / month', '3 dashboards', 'CSV & Excel support', 'Email export', 'Community support'], cta: 'Get Started Free', featured: false },
            { name: 'Pro', price: '$29', period: '/month', desc: 'For analysts and growing teams', features: ['Unlimited uploads', '2,000 AI queries / month', 'Unlimited dashboards', 'All file formats', 'PDF, Excel & PPT export', 'Scheduled reports', 'Priority support'], cta: 'Start Pro Trial', featured: true },
            { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations', features: ['Unlimited everything', 'SSO & SAML', 'SOC 2 compliance', 'Custom AI models', 'Dedicated account manager', 'SLA guarantee', 'On-premise deployment'], cta: 'Contact Sales', featured: false },
          ].map(({ name, price, period, desc, features, cta, featured }) => (
            <Card key={name} className={cn('p-8', featured && 'border-[#4F46E5] border-2 relative')}>
              {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-[10px] font-bold px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{price}</span>
                {period && <span className="text-sm text-muted-foreground">{period}</span>}
              </div>
              <Button variant={featured ? 'primary' : 'secondary'} className="w-full mt-6" onClick={() => onNavigate('signup')}>
                {cta}
              </Button>
              <ul className="mt-8 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#4F46E5] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Loved by data teams everywhere</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, initials }) => (
              <Card key={name} className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto px-6 py-28">
        <div className="text-center mb-12">
          <Badge>FAQ</Badge>
          <h2 className="mt-5 text-3xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <Card key={i} className="overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="text-sm font-medium text-foreground pr-4">{q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Ready to unlock your data?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join 50,000+ analysts who stopped guessing and started knowing.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => onNavigate('signup')}>
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="lg">Talk to Sales</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────

function AuthPage({
  mode,
  onNavigate,
  onLogin,
  isDark,
  onToggleDark,
}: {
  mode: 'signin' | 'signup';
  onNavigate: (p: Page) => void;
  onLogin: (u: AppUser) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: 'Sarah Reynolds', email: email || 'sarah@example.com', plan: 'Pro' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="h-14 border-b border-border flex items-center px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>InsightAI</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onToggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === 'signin' ? 'Sign in to access your dashboard' : 'Start your 14-day free trial'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <Button variant="secondary" className="w-full" onClick={handleSubmit}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="primary" className="w-full">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => onNavigate(mode === 'signin' ? 'signup' : 'signin')} className="text-[#4F46E5] font-medium hover:underline">
              {mode === 'signin' ? 'Start free' : 'Sign in'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardHome({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Good morning, Sarah</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening with your data today.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => onNavigate('upload')}>
          <Upload className="w-3.5 h-3.5" /> Upload Data
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', up: true, icon: DollarSign },
          { label: 'AI Queries', value: '1,247', change: '+8.3%', up: true, icon: MessageSquare },
          { label: 'Active Projects', value: '24', change: '+3', up: true, icon: FolderOpen },
          { label: 'Insights Generated', value: '89', change: '+23%', up: true, icon: Lightbulb },
        ].map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
            <div className={cn('text-xs flex items-center gap-1 font-medium mt-1', up ? 'text-emerald-500' : 'text-red-500')}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue for 2024</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm"><Calendar className="w-3.5 h-3.5" /> This Year</Button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($K)" stroke="#4F46E5" strokeWidth={2} fill="url(#colorRevenue)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: 'var(--font-display)' }}>Revenue by Plan</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{name}</span>
                </div>
                <span className="font-medium text-foreground">{value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Weekly Activity</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="queries" name="Queries" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Recent Projects</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('projects')}>View All</Button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map(({ name, lastActive, status, queries }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{lastActive}</div>
                  </div>
                </div>
                <Badge variant={status === 'active' ? 'info' : status === 'complete' ? 'success' : 'default'}>{status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Upload Page ──────────────────────────────────────────────────────────────

function UploadPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Upload Data</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Upload Excel, CSV, or JSON files for AI analysis</p>
      </div>

      <Card className={cn('p-12 text-center border-2 border-dashed transition-colors cursor-pointer', dragOver ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-border hover:border-[#4F46E5]/40 hover:bg-muted/20')}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center mx-auto mb-5">
          <Upload className="w-7 h-7 text-[#4F46E5]" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Drag & drop your files here
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          or click to browse. Supports .xlsx, .csv, .json, .tsv
        </p>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> Choose Files
        </Button>
      </Card>

      <Card className="mt-6 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Uploaded Files</h3>
        <div className="space-y-3">
          {[
            { name: 'Q4_Sales_Report.xlsx', size: '2.4 MB', status: 'ready', progress: 100 },
            { name: 'Customer_Data.csv', size: '1.8 MB', status: 'ready', progress: 100 },
            { name: 'Marketing_Metrics.xlsx', size: '3.1 MB', status: 'uploading', progress: 67 },
          ].map(({ name, size, status, progress }) => (
            <div key={name} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{name}</div>
                <div className="text-xs text-muted-foreground">{size}</div>
                {status === 'uploading' && (
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#4F46E5] rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
              <Badge variant={status === 'ready' ? 'success' : 'info'}>{status}</Badge>
              <Button variant="ghost" size="icon"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Storage Usage</h3>
          <span className="text-xs text-muted-foreground">4.4 MB / 10 GB</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: '0.04%' }} />
        </div>
      </Card>
    </div>
  );
}

// ─── Chat Page ────────────────────────────────────────────────────────────────

function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="flex h-full">
      <div className="hidden md:flex w-64 border-r border-border bg-card flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <Button variant="primary" size="sm" className="w-full">
            <Plus className="w-3.5 h-3.5" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {['Revenue analysis Q4', 'Customer churn patterns', 'Marketing ROI breakdown'].map((title, i) => (
            <button key={title} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', i === 0 ? 'bg-[#4F46E5]/10 text-[#4F46E5] font-medium' : 'text-muted-foreground hover:bg-muted')}>
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3 max-w-3xl', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold', msg.role === 'user' ? 'bg-[#4F46E5]' : 'bg-muted')}>
                {msg.role === 'user' ? 'SR' : <Sparkles className="w-4 h-4 text-[#4F46E5]" />}
              </div>
              <div className={cn('rounded-xl px-4 py-3 text-sm leading-relaxed', msg.role === 'user' ? 'bg-[#4F46E5] text-white' : 'bg-card border border-border text-foreground')}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Input placeholder="Ask about your data..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
            <Button variant="primary" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Builder Page ─────────────────────────────────────────────────────────────

function DashboardBuilder() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Dashboard Builder</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Drag and drop widgets to build custom dashboards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-3.5 h-3.5" /> Export</Button>
          <Button variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> Add Widget</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="builderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($K)" stroke="#4F46E5" strokeWidth={2} fill="url(#builderGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Queries by Day</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="queries" name="Queries" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>User Growth</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <ReLineChart type="monotone" dataKey="users" name="Users" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Product Revenue</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="Revenue ($K)" fill="#10B981" radius={[0, 4, 4, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Insights Page ────────────────────────────────────────────────────────────

function InsightsPage() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Insights</h2>
          <p className="text-sm text-muted-foreground mt-0.5">AI-generated analysis and recommendations</p>
        </div>
        <Button variant="primary" size="sm"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Executive Summary</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Revenue is up 12.5% month-over-month, driven primarily by Enterprise tier growth. Query volume has increased 8.3%, indicating strong user engagement. 3 anomalies detected requiring attention. Overall business health: Strong.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Detected Anomalies
          </h3>
          <div className="space-y-3">
            {anomalies.map(({ title, desc, severity }) => (
              <Card key={title} className="p-4 flex gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950/60' : severity === 'danger' ? 'bg-red-50 dark:bg-red-950/60' : 'bg-blue-50 dark:bg-blue-950/60')}>
                  <AlertTriangle className={cn('w-4 h-4', severity === 'warning' ? 'text-amber-500' : severity === 'danger' ? 'text-red-500' : 'text-blue-500')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{title}</span>
                    <Badge variant={severity === 'warning' ? 'warning' : severity === 'danger' ? 'danger' : 'info'}>{severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <Sparkles className="w-4 h-4 text-[#4F46E5]" /> AI Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map(({ title, desc, priority }) => (
              <Card key={title} className="p-4 flex gap-3 hover:border-[#4F46E5]/30 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{title}</span>
                    <Badge variant={priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'default'}>{priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Revenue Forecast — Q4 2024 → Q1 2025</h3>
            <p className="text-xs text-muted-foreground mt-0.5">AI projection based on trailing 12-month trend · confidence 87%</p>
          </div>
          <Badge variant="purple"><Sparkles className="w-2.5 h-2.5" /> Projected +15.2%</Badge>
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
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}K`} />
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

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Reports</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Saved, scheduled, and exported reports</p>
        </div>
        <Button variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> New Report</Button>
      </div>

      <div className="flex gap-0 border-b border-border">
        {['All Reports', 'Scheduled', 'Drafts', 'Archived'].map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors', activeTab === i ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-muted-foreground hover:text-foreground')}>
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
          <div key={name} className="px-5 py-4 grid grid-cols-12 gap-4 items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
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
              <Badge variant={type === 'AI Generated' ? 'info' : type === 'Scheduled' ? 'purple' : 'default'}>{type}</Badge>
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">{created}</div>
            <div className="col-span-1">
              <Badge variant={status === 'ready' ? 'success' : 'warning'}>{status}</Badge>
            </div>
            <div className="col-span-2 flex gap-1">
              <Button variant="ghost" size="icon"><Download className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon"><Share2 className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────

function ProjectsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Projects</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} projects · {projects.filter((p) => p.status === 'active').length} active</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => onNavigate('upload')}>
          <Plus className="w-3.5 h-3.5" /> New Project
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" />
        </div>
        <Button variant="secondary" size="md"><Filter className="w-3.5 h-3.5" /> Filter</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ name, files, queries, lastActive, status, insights }) => (
          <Card key={name} className="p-5 hover:border-[#4F46E5]/30 transition-colors cursor-pointer group" onClick={() => onNavigate('chat')}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={status === 'active' ? 'info' : status === 'complete' ? 'success' : 'default'}>{status}</Badge>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-[15px]" style={{ fontFamily: 'var(--font-display)' }}>{name}</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span>{files} files</span>
              <span>{queries} queries</span>
              <span>{insights} insights</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> {lastActive}
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}

        <button onClick={() => onNavigate('upload')} className="border-2 border-dashed border-border rounded-xl p-5 hover:border-[#4F46E5]/40 hover:bg-muted/20 transition-all flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">New Project</span>
        </button>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'billing', label: 'Billing' },
    { id: 'security', label: 'Security' },
    { id: 'api', label: 'API Keys' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, workspace, and preferences</p>
      </div>

      <div className="flex gap-0 border-b border-border mb-7 overflow-x-auto">
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap', activeTab === id ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: 'var(--font-display)' }}>Profile Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xl font-bold">SR</div>
              <div>
                <Button variant="secondary" size="sm">Change Photo</Button>
                <div className="text-xs text-muted-foreground mt-1.5">JPG, PNG up to 5 MB</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{ label: 'First name', value: 'Sarah' }, { label: 'Last name', value: 'Reynolds' }, { label: 'Email', value: 'sarah@acmecorp.com' }, { label: 'Job title', value: 'Head of Analytics' }].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                  <input defaultValue={value} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all" />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="primary" size="sm">Save Changes</Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Dark mode</div>
                <div className="text-xs text-muted-foreground mt-0.5">Switch between light and dark themes</div>
              </div>
              <button onClick={onToggleDark} className={cn('relative w-10 h-6 rounded-full transition-colors flex-shrink-0', isDark ? 'bg-[#4F46E5]' : 'bg-muted')}>
                <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', isDark && 'translate-x-4')} />
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Current Plan</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Pro</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">$29 / month · Renews Jan 1, 2025</div>
              </div>
              <Button variant="secondary" size="sm">Upgrade</Button>
            </div>
            <div className="space-y-3">
              {[{ label: 'AI Queries', used: 1247, total: 2000, unit: '' }, { label: 'Storage', used: 4.4, total: 10240, unit: ' MB' }].map(({ label, used, total, unit }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-medium">{used}{unit} / {total}{unit}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${Math.min((used / total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Payment Method</h3>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/2026</div>
              </div>
              <Button variant="ghost" size="sm">Update</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Change Password</h3>
            <div className="space-y-3">
              {['Current password', 'New password', 'Confirm new password'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent" />
                </div>
              ))}
              <div className="flex justify-end mt-2">
                <Button variant="primary" size="sm">Update Password</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Two-factor authentication</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Add an extra layer of security with TOTP or hardware keys.</p>
              </div>
              <Badge variant="warning">Not enabled</Badge>
            </div>
            <Button variant="secondary" size="sm" className="mt-4">Enable 2FA</Button>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Active Sessions</h3>
            <div className="space-y-3">
              {[{ device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', current: true }, { device: 'iPhone 15 · Safari', location: 'San Francisco, CA', current: false }].map(({ device, location, current }) => (
                <div key={device} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                      {device}
                      {current && <Badge variant="success">Current</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{location}</div>
                  </div>
                  {!current && <Button variant="ghost" size="sm">Revoke</Button>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'api' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>API Keys</h3>
            <Button variant="primary" size="sm"><Plus className="w-3.5 h-3.5" /> Generate Key</Button>
          </div>
          <div className="space-y-3">
            {[{ name: 'Production Key', key: 'sk-live-••••••••••••••••4a2b', created: 'Dec 1, 2024', lastUsed: '2 hours ago' }, { name: 'Development Key', key: 'sk-test-••••••••••••••••8f3c', created: 'Nov 15, 2024', lastUsed: '3 days ago' }].map(({ name, key, created, lastUsed }) => (
              <div key={name} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-foreground">{name}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Eye className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground bg-muted rounded px-2.5 py-1.5 mb-2">{key}</div>
                <div className="text-xs text-muted-foreground">Created {created} · Last used {lastUsed}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5" style={{ fontFamily: 'var(--font-display)' }}>Notification Preferences</h3>
          <div className="space-y-0">
            {[{ title: 'Weekly digest', desc: 'Summary of your data insights every Monday morning', enabled: true }, { title: 'Anomaly alerts', desc: 'Immediate notification when AI detects unusual patterns', enabled: true }, { title: 'Report ready', desc: 'Notification when scheduled reports are generated', enabled: false }, { title: 'Query limit warning', desc: 'Alert at 80% of monthly query usage', enabled: true }, { title: 'Product updates', desc: 'News about new features and improvements', enabled: false }].map(({ title, desc, enabled }) => (
              <div key={title} className="flex items-start justify-between py-4 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
                <button className={cn('relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-6', enabled ? 'bg-[#4F46E5]' : 'bg-muted')}>
                  <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', enabled && 'translate-x-4')} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'workspace' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Workspace Settings</h3>
            <div className="space-y-4">
              {[{ label: 'Workspace name', value: 'Acme Corp Analytics' }, { label: 'Workspace URL', value: 'acme-corp.insightai.com' }].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                  <input defaultValue={value} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all" />
                </div>
              ))}
              <div className="flex justify-end">
                <Button variant="primary" size="sm">Save</Button>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-red-200 dark:border-red-900">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Danger Zone</h3>
            <p className="text-xs text-muted-foreground mb-4">Permanently delete your workspace and all associated data. This action cannot be undone.</p>
            <Button variant="danger" size="sm">Delete Workspace</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navigate = (p: Page) => {
    const publicPages: Page[] = ['landing', 'signin', 'signup'];
    if (!user && !publicPages.includes(p)) {
      setPage('signin');
      return;
    }
    setPage(p);
    setSidebarOpen(false);
    if (!['chat'].includes(p)) {
      window.scrollTo(0, 0);
    }
  };

  const handleLogin = (u: AppUser) => {
    setUser(u);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  if (page === 'landing') {
    return <LandingPage onNavigate={navigate} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />;
  }

  if (page === 'signin' || page === 'signup') {
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
      <Sidebar page={page} onNavigate={navigate} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-60 overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} page={page} />

        <main className="flex-1 overflow-y-auto bg-background">
          {page === 'dashboard' && <DashboardHome onNavigate={navigate} />}
          {page === 'upload' && <UploadPage />}
          {page === 'chat' && <ChatPage />}
          {page === 'builder' && <DashboardBuilder />}
          {page === 'insights' && <InsightsPage />}
          {page === 'reports' && <ReportsPage />}
          {page === 'projects' && <ProjectsPage onNavigate={navigate} />}
          {page === 'settings' && <SettingsPage isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />}
        </main>
      </div>
    </div>
  );
}