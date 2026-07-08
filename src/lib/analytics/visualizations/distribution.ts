import type { VisualizationRecommendation } from "./types";
import type { ProfiledColumn } from "../profile/types";
import type { CorrelationPair } from "../patterns/types";

function generateScatterTitle(xAxis: string, yAxis: string): string {
  const xName = xAxis.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const yName = yAxis.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${yName} vs ${xName}`;
}

function generateHistogramTitle(column: string): string {
  const columnName = column.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `Distribution of ${columnName}`;
}

function generateTableTitle(): string {
  return 'Data Table';
}

export function recommendScatterPlots(
  profiledColumns: ProfiledColumn[],
  correlations: CorrelationPair[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const strongCorrelations = correlations
    .filter(c => c.strength === 'strong' || c.strength === 'moderate')
    .slice(0, 3);
  
  for (const corr of strongCorrelations) {
    const confidence = corr.strength === 'strong' ? 0.75 : 0.6;
    
    recommendations.push({
      chartType: 'scatter',
      title: generateScatterTitle(corr.column1, corr.column2),
      xAxis: corr.column1,
      yAxis: corr.column2,
      confidence,
      reason: `${corr.strength} ${corr.direction} correlation (r=${corr.coefficient}) between '${corr.column1}' and '${corr.column2}'`,
    });
  }
  
  return recommendations;
}

export function recommendHistograms(
  profiledColumns: ProfiledColumn[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const numericColumns = profiledColumns.filter(col => 
    col.statistics.type === 'numeric' &&
    col.semanticType !== 'identifier'
  );
  
  for (const col of numericColumns.slice(0, 3)) {
    const stats = col.statistics.type === 'numeric' ? col.statistics.stats : null;
    const hasVariation = stats && stats.stdDev > 0;
    
    if (hasVariation) {
      recommendations.push({
        chartType: 'histogram',
        title: generateHistogramTitle(col.name),
        xAxis: col.name,
        confidence: 0.6,
        reason: `Numeric column '${col.name}' with standard deviation ${stats?.stdDev}`,
      });
    }
  }
  
  return recommendations;
}

export function recommendTables(
  profiledColumns: ProfiledColumn[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  recommendations.push({
    chartType: 'table',
    title: generateTableTitle(),
    confidence: 0.5,
    reason: 'Default data table for viewing raw data',
  });
  
  return recommendations;
}
