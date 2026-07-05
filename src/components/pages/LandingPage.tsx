import { useState } from 'react';
import {
  LayoutDashboard, Upload, MessageSquare, BarChart2, Lightbulb,
  ChevronDown, ChevronUp, ArrowRight, Check, TrendingUp,
  TrendingDown, AlertTriangle, Download, Sparkles, Play,
  Shield, Layers
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Footer } from '../layout/Footer';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

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

export function LandingPage() {
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              InsightAI
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground flex-1">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href="/signin" className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground">
              Sign in
            </a>
            <a href="/signup" className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
              Start Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
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
              <a href="/signup" className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-6 py-3 text-sm bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm active:scale-[0.98]">
                Start Free <ArrowRight className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-6 py-3 text-sm bg-transparent border border-border text-foreground hover:bg-muted active:scale-[0.98]">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
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

      {/* Stats */}
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

      {/* Features */}
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

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/40 border-y border-border py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge>How it works</Badge>
            <h2 className="mt-5 text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              From raw data to board-ready insights in minutes
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to transform your spreadsheets into actionable intelligence. No technical expertise required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: Upload, title: 'Upload your files', desc: 'Drag and drop Excel, CSV, or Google Sheets files. Connect multiple data sources and let InsightAI understand your schema automatically. No setup or configuration needed.' },
              { step: '02', icon: MessageSquare, title: 'Ask in plain English', desc: 'Type questions like "What was our best month?" or "Show me sales by region." No SQL. No filters. No training required — just type and get answers.' },
              { step: '03', icon: BarChart2, title: 'Get instant insights', desc: 'AI generates charts, KPIs, anomaly reports, and forecasts. Export to PDF, share with your team, or schedule weekly digests automatically.' },
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

      {/* Pricing */}
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
              <a href="/signup" className={cn('inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer w-full mt-6 px-4 py-2 text-sm', featured ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm' : 'bg-transparent border border-border text-foreground hover:bg-muted')}>
                {cta}
              </a>
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

      {/* Testimonials */}
      <section className="bg-muted/40 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Loved by data teams everywhere</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, initials }) => (
              <Card key={name} className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">&quot;{quote}&quot;</p>
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

      {/* FAQ */}
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

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Ready to unlock your data?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join 50,000+ analysts who stopped guessing and started knowing.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/signup" className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-6 py-3 text-sm bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm active:scale-[0.98]">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-6 py-3 text-sm bg-transparent border border-border text-foreground hover:bg-muted active:scale-[0.98]">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}