import type { SemanticColumn } from "../semantic/types";
import type { DatasetStatProfile, ProfiledColumn } from "../profile/types";
import type { DatasetPatterns, DimensionCandidate, MeasureCandidate, CorrelationPair } from "../patterns/types";
import type { DatasetKPIs, DiscoveredKPI } from "../kpi/types";
import type { DatasetVisualizations, VisualizationRecommendation } from "./types";
import { recommendKPICards } from "./kpi-card";
import { recommendTimeSeriesCharts, recommendBarCharts, recommendColumnCharts } from "./categorical";
import { recommendPieCharts, recommendDonutCharts } from "./proportional";
import { recommendScatterPlots, recommendHistograms, recommendTables } from "./distribution";

function deduplicateRecommendations(recommendations: VisualizationRecommendation[]): VisualizationRecommendation[] {
  const seen = new Set<string>();
  const unique: VisualizationRecommendation[] = [];
  
  for (const rec of recommendations) {
    const key = `${rec.chartType}-${rec.xAxis || ''}-${rec.yAxis || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(rec);
    }
  }
  
  return unique;
}

function sortRecommendations(recommendations: VisualizationRecommendation[]): VisualizationRecommendation[] {
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

export function recommendVisualizations(
  semanticColumns: SemanticColumn[],
  statProfile: DatasetStatProfile,
  patterns: DatasetPatterns,
  kpis: DatasetKPIs
): DatasetVisualizations {
  const recommendations: VisualizationRecommendation[] = [];
  
  recommendations.push(...recommendKPICards(kpis.kpis));
  
  recommendations.push(...recommendTimeSeriesCharts(
    statProfile.columns,
    patterns.dimensionCandidates,
    patterns.measureCandidates,
    kpis.kpis
  ));
  
  recommendations.push(...recommendBarCharts(
    statProfile.columns,
    patterns.dimensionCandidates,
    patterns.measureCandidates,
    kpis.kpis
  ));
  
  recommendations.push(...recommendColumnCharts(
    statProfile.columns,
    patterns.dimensionCandidates,
    patterns.measureCandidates,
    kpis.kpis
  ));
  
  recommendations.push(...recommendPieCharts(
    statProfile.columns,
    patterns.dimensionCandidates
  ));
  
  recommendations.push(...recommendDonutCharts(
    statProfile.columns,
    patterns.dimensionCandidates
  ));
  
  recommendations.push(...recommendScatterPlots(
    statProfile.columns,
    patterns.correlations
  ));
  
  recommendations.push(...recommendHistograms(statProfile.columns));
  
  recommendations.push(...recommendTables(statProfile.columns));
  
  const uniqueRecommendations = deduplicateRecommendations(recommendations);
  const sortedRecommendations = sortRecommendations(uniqueRecommendations);
  
  return {
    recommendations: sortedRecommendations.slice(0, 15),
    recommendedAt: new Date(),
  };
}
