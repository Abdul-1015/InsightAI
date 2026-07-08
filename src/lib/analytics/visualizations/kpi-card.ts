import type { VisualizationRecommendation } from "./types";
import type { DiscoveredKPI } from "../kpi/types";

function generateKPICardTitle(kpi: DiscoveredKPI): string {
  const columnName = kpi.columnName
    .replace(/[_\-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  
  return `${kpi.aggregation} of ${columnName}`;
}

export function recommendKPICards(kpis: DiscoveredKPI[]): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const topKPIs = kpis
    .filter(kpi => kpi.confidence >= 0.5)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
  
  for (const kpi of topKPIs) {
    recommendations.push({
      chartType: 'kpi_card',
      title: generateKPICardTitle(kpi),
      yAxis: kpi.columnName,
      aggregation: kpi.aggregation,
      confidence: kpi.confidence,
      reason: `High-confidence KPI (${Math.round(kpi.confidence * 100)}% confidence) with ${kpi.aggregation} aggregation`,
    });
  }
  
  return recommendations;
}
