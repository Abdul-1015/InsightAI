import type { VisualizationRecommendation } from "./types";
import type { ProfiledColumn } from "../profile/types";
import type { DimensionCandidate } from "../patterns/types";

function generatePieDonutTitle(dimension: string, measure: string): string {
  const dimensionName = dimension.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const measureName = measure.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${measureName} by ${dimensionName}`;
}

function isPieDonutCandidate(col: ProfiledColumn): boolean {
  if (col.statistics.type !== 'categorical') return false;
  
  const uniqueCount = col.statistics.stats.uniqueCount;
  return uniqueCount >= 2 && uniqueCount <= 8;
}

export function recommendPieCharts(
  profiledColumns: ProfiledColumn[],
  dimensionCandidates: DimensionCandidate[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const pieDimensions = profiledColumns.filter(col => isPieDonutCandidate(col));
  
  for (const dim of pieDimensions.slice(0, 3)) {
    const topValue = dim.statistics.type === 'categorical' 
      ? dim.statistics.stats.mostFrequentValue 
      : null;
    
    recommendations.push({
      chartType: 'pie',
      title: generatePieDonutTitle(dim.name, 'Distribution'),
      xAxis: dim.name,
      confidence: 0.6,
      reason: `Categorical dimension '${dim.name}' with ${dim.statistics.type === 'categorical' ? dim.statistics.stats.uniqueCount : 0} unique values (ideal for pie chart)`,
    });
  }
  
  return recommendations;
}

export function recommendDonutCharts(
  profiledColumns: ProfiledColumn[],
  dimensionCandidates: DimensionCandidate[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const donutDimensions = profiledColumns.filter(col => isPieDonutCandidate(col));
  
  for (const dim of donutDimensions.slice(0, 3)) {
    recommendations.push({
      chartType: 'donut',
      title: generatePieDonutTitle(dim.name, 'Distribution'),
      xAxis: dim.name,
      confidence: 0.6,
      reason: `Categorical dimension '${dim.name}' with ${dim.statistics.type === 'categorical' ? dim.statistics.stats.uniqueCount : 0} unique values (ideal for donut chart)`,
    });
  }
  
  return recommendations;
}
