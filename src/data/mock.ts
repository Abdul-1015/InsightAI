export const revenueData = [
  { month: 'Jan', revenue: 145, queries: 820 },
  { month: 'Feb', revenue: 158, queries: 940 },
  { month: 'Mar', revenue: 142, queries: 870 },
  { month: 'Apr', revenue: 175, queries: 1100 },
  { month: 'May', revenue: 168, queries: 1050 },
  { month: 'Jun', revenue: 192, queries: 1240 },
  { month: 'Jul', revenue: 205, queries: 1380 },
  { month: 'Aug', revenue: 198, queries: 1290 },
  { month: 'Sep', revenue: 215, queries: 1450 },
  { month: 'Oct', revenue: 228, queries: 1580 },
  { month: 'Nov', revenue: 242, queries: 1720 },
  { month: 'Dec', revenue: 255, queries: 1890 },
];

export const pieData = [
  { name: 'Enterprise', value: 42, color: '#4F46E5' },
  { name: 'Growth', value: 28, color: '#7C3AED' },
  { name: 'Starter', value: 20, color: '#06B6D4' },
  { name: 'Free', value: 10, color: '#94A3B8' },
];

export const weeklyData = [
  { day: 'Mon', uploads: 24, queries: 180 },
  { day: 'Tue', uploads: 31, queries: 215 },
  { day: 'Wed', uploads: 28, queries: 198 },
  { day: 'Thu', uploads: 42, queries: 267 },
  { day: 'Fri', uploads: 38, queries: 243 },
  { day: 'Sat', uploads: 12, queries: 89 },
  { day: 'Sun', uploads: 8, queries: 67 },
];

export const forecastData = [
  { month: 'Jan', actual: 145, forecast: null },
  { month: 'Feb', actual: 158, forecast: null },
  { month: 'Mar', actual: 142, forecast: null },
  { month: 'Apr', actual: 175, forecast: null },
  { month: 'May', actual: 168, forecast: null },
  { month: 'Jun', actual: 192, forecast: null },
  { month: 'Jul', actual: 205, forecast: null },
  { month: 'Aug', actual: 198, forecast: null },
  { month: 'Sep', actual: 215, forecast: null },
  { month: 'Oct', actual: null, forecast: 235 },
  { month: 'Nov', actual: null, forecast: 258 },
  { month: 'Dec', actual: null, forecast: 278 },
];

export const productData = [
  { name: 'Enterprise Suite', revenue: 842 },
  { name: 'Analytics Pro', revenue: 512 },
  { name: 'Starter Pack', revenue: 287 },
  { name: 'Team Plan', revenue: 198 },
  { name: 'API Access', revenue: 143 },
];

export const userGrowthData = revenueData.map((d, i) => ({
  month: d.month,
  users: 1200 + i * 165,
}));

export const reports = [
  { name: 'Q4 2024 Executive Summary', type: 'AI Generated', created: 'Dec 28, 2024', status: 'ready', size: '2.4 MB' },
  { name: 'Customer Churn Analysis', type: 'Scheduled', created: 'Dec 25, 2024', status: 'ready', size: '1.8 MB' },
  { name: 'Marketing ROI Report', type: 'Manual', created: 'Dec 20, 2024', status: 'ready', size: '3.1 MB' },
  { name: 'Weekly Metrics - W50', type: 'Scheduled', created: 'Dec 16, 2024', status: 'ready', size: '890 KB' },
  { name: 'Annual Forecast 2025', type: 'AI Generated', created: 'Dec 10, 2024', status: 'draft', size: '4.2 MB' },
  { name: 'Board Presentation Q3', type: 'Manual', created: 'Oct 1, 2024', status: 'ready', size: '6.8 MB' },
];

export const projects = [
  { name: 'Q4 Sales Analysis', files: 3, queries: 47, lastActive: '2 hours ago', status: 'active', insights: 12 },
  { name: 'Customer Churn Study', files: 2, queries: 31, lastActive: 'Yesterday', status: 'complete', insights: 8 },
  { name: 'Marketing ROI 2024', files: 5, queries: 62, lastActive: '3 days ago', status: 'active', insights: 19 },
  { name: 'Inventory Forecast Q1', files: 1, queries: 15, lastActive: '1 week ago', status: 'complete', insights: 5 },
  { name: 'Competitor Analysis', files: 4, queries: 28, lastActive: '2 weeks ago', status: 'archived', insights: 7 },
  { name: 'HR Analytics Q3', files: 2, queries: 19, lastActive: '1 month ago', status: 'archived', insights: 4 },
];

export const anomalies = [
  { title: 'Revenue spike in Q3', desc: 'Unusual 23% increase in Enterprise tier revenue during August. Correlates with new product launch.', severity: 'warning' },
  { title: 'Query pattern shift', desc: 'AI query volume dropped 15% week-over-week. May indicate user churn or feature adoption issues.', severity: 'danger' },
  { title: 'Export usage surge', desc: 'PDF exports increased 340% this month. Consider optimizing export pipeline for scale.', severity: 'info' },
];

export const recommendations = [
  { title: 'Upgrade churn risk users', desc: '12 users show declining engagement patterns. Send targeted re-engagement campaign.', priority: 'High' },
  { title: 'Optimize query performance', desc: 'Average query time increased to 2.3s. Consider caching frequently accessed datasets.', priority: 'Medium' },
  { title: 'Launch referral program', desc: 'Organic growth is 3x paid acquisition. A referral program could accelerate signups.', priority: 'Low' },
];

export const chatMessages = [
  { role: 'user', content: 'What were our top performing products last quarter?' },
  { role: 'assistant', content: 'Based on Q4 2024 data, here are your top performing products by revenue:\n\n1. **Enterprise Suite** - $842K (42% of total)\n2. **Analytics Pro** - $512K (26%)\n3. **Starter Pack** - $287K (14%)\n\nThe Enterprise Suite continues to be your strongest revenue driver, with a 15% increase from Q3. Would you like me to break down the revenue by region or customer segment?' },
  { role: 'user', content: 'Show me the churn rate by plan type' },
  { role: 'assistant', content: 'Here\'s the churn analysis by plan type for Q4 2024:\n\n| Plan | Churn Rate | Users Lost |\n|------|------------|------------|\n| Enterprise | 2.1% | 4 |\n| Growth | 5.8% | 23 |\n| Starter | 12.3% | 67 |\n| Free | 28.4% | 342 |\n\n**Key Insight:** The Starter tier shows the highest proportional churn among paid users. Consider implementing a retention campaign targeting users in their first 30 days.' },
];