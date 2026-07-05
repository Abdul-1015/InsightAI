import { useState } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Info, Sparkles, ArrowRight, Filter, Calendar, RefreshCw, Download, Share, Copy, MoreHorizontal, Check, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { anomalies, recommendations, revenueData, pieData } from '../../data/mock';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type InsightCategory = 'all' | 'anomalies' | 'trends' | 'recommendations';

export function InsightsPage() {
  const [category, setCategory] = useState<InsightCategory>('all');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const insights = [
    {
      id: 'insight-1',
      type: 'anomaly',
      title: 'Revenue Spike in Enterprise Tier',
      description: 'Enterprise tier revenue increased 23% in August, significantly above the 8% monthly average. This correlates with the new product launch on August 15th.',
      impact: 'high',
      metric: 'Revenue',
      value: '$842K',
      change: '+23%',
      actionable: true,
      recommendation: 'Consider doubling down on enterprise sales efforts. The product launch appears to have resonated strongly with this segment.',
    },
    {
      id: 'insight-2',
      type: 'trend',
      title: 'Starter Tier Churn Accelerating',
      description: 'Churn rate for Starter tier increased from 8.2% to 12.3% over the past 3 months. This is 3x higher than Enterprise tier churn.',
      impact: 'high',
      metric: 'Churn Rate',
      value: '12.3%',
      change: '+4.1%',
      actionable: true,
      recommendation: 'Implement a targeted retention campaign for Starter users in their first 30 days. Consider adding a guided onboarding flow.',
    },
    {
      id: 'insight-3',
      type: 'trend',
      title: 'Query Volume Plateau',
      description: 'Weekly AI query volume has plateaued at ~1,800 queries/week after 6 months of consistent 15% MoM growth.',
      impact: 'medium',
      metric: 'Queries/Week',
      value: '1,800',
      change: '0%',
      actionable: true,
      recommendation: 'Investigate if this is due to market saturation or feature adoption issues. Consider running user surveys.',
    },
    {
      id: 'insight-4',
      type: 'recommendation',
      title: 'Optimize Export Pipeline',
      description: 'PDF export requests increased 340% this month. Current export pipeline may not scale well beyond 500 concurrent requests.',
      impact: 'medium',
      metric: 'Export Requests',
      value: '2,450',
      change: '+340%',
      actionable: true,
      recommendation: 'Implement async export processing and add caching for frequently generated reports.',
    },
    {
      id: 'insight-5',
      type: 'anomaly',
      title: 'Weekend Query Pattern Shift',
      description: 'Weekend query volume dropped 15% week-over-week. This is unusual as weekends typically show stable or growing usage.',
      impact: 'low',
      metric: 'Weekend Queries',
      value: '890',
      change: '-15%',
      actionable: false,
      recommendation: 'Monitor for 2 more weeks before taking action. Could be seasonal variation.',
    },
    {
      id: 'insight-6',
      type: 'trend',
      title: 'API Usage Growing Faster Than Users',
      description: 'API call volume grew 45% MoM while active users grew only 12%. This indicates increasing power user engagement.',
      impact: 'medium',
      metric: 'API Calls',
      value: '1.2M',
      change: '+45%',
      actionable: true,
      recommendation: 'Consider introducing API rate limits for free tier and premium API access for power users.',
    },
  ];

  const filteredInsights = category === 'all' 
    ? insights 
    : insights.filter(i => i.type === category);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-[#4F46E5]" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-amber-500/10 text-amber-500';
      case 'low': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered analysis of your data patterns and trends</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <Card className="p-4 bg-[#4F46E5]/5 border-[#4F46E5]/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#4F46E5]" style={{ fontFamily: 'var(--font-display)' }}>AI Summary</div>
            <p className="text-sm text-muted-foreground mt-1">Found 6 actionable insights across your data. 2 high-impact items require immediate attention: Enterprise revenue spike and Starter tier churn acceleration.</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'anomalies', 'trends', 'recommendations'] as InsightCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              category === cat ? 'bg-[#4F46E5] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="overflow-hidden">
            <button
              className="w-full p-4 text-left"
              onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                      {insight.title}
                    </h3>
                    <Badge className={cn('text-[9px]', getImpactColor(insight.impact))}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    {insight.value}
                  </div>
                  <div className={cn('text-xs font-medium', insight.change.startsWith('+') ? 'text-emerald-500' : insight.change.startsWith('-') ? 'text-red-500' : 'text-muted-foreground')}>
                    {insight.change}
                  </div>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expandedInsight === insight.id && 'rotate-180')} />
              </div>
            </button>
            
            {expandedInsight === insight.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                <div className="pt-3 space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs font-medium text-foreground mb-1">Recommendation</div>
                    <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5" /> Take Action
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
                      <Share className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
            <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">+12.5%</Badge>
          </div>
          <div className="h-24 flex items-end gap-1">
            {revenueData.slice(-6).map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#4F46E5] rounded-t" style={{ height: `${(d.revenue / 255) * 100}%` }} />
                <span className="text-[8px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>User Segments</h3>
            <Badge className="text-[9px]">2,898 users</Badge>
          </div>
          <div className="space-y-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                <span className="text-xs font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Query Volume</h3>
            <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">+23%</Badge>
          </div>
          <div className="h-24 flex items-end gap-1">
            {revenueData.slice(-6).map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#818CF8] rounded-t" style={{ height: `${(d.queries / 1890) * 100}%` }} />
                <span className="text-[8px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}