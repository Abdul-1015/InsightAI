import type { VisualizationRecommendation, ChartType } from "./types";
import type { ProfiledColumn } from "../profile/types";
import type { DimensionCandidate, MeasureCandidate } from "../patterns/types";
import type { DiscoveredKPI } from "../kpi/types";
import type { AggregationType } from "../kpi/types";

function generateTimeSeriesTitle(measure: string, dimension: string): string {
  const measureName = measure.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const dimensionName = dimension.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${measureName} by ${dimensionName}`;
}

function generateCategoricalTitle(measure: string, dimension: string): string {
  const measureName = measure.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const dimensionName = dimension.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${measureName} by ${dimensionName}`;
}

function isTimeDimension(col: ProfiledColumn): boolean {
  return col.semanticType === 'timeline' || 
         col.statistics.type === 'date';
}

function isCategoricalDimension(col: ProfiledColumn): boolean {
  return col.semanticType === 'category' ||
         col.semanticType === 'geography' ||
         col.semanticType === 'person_name' ||
         col.semanticType === 'company_name' ||
         (col.statistics.type === 'categorical' && col.statistics.stats.uniqueCount <= 20);
}

function getBestAggregation(kpis: DiscoveredKPI[], columnName: string): AggregationType {
  const kpi = kpis.find(k => k.columnName === columnName);
  return kpi?.aggregation || 'SUM';
}

export function recommendTimeSeriesCharts(
  profiledColumns: ProfiledColumn[],
  dimensionCandidates: DimensionCandidate[],
  measureCandidates: MeasureCandidate[],
  kpis: DiscoveredKPI[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const timeDimensions = profiledColumns.filter(col => isTimeDimension(col));
  const measures = profiledColumns.filter(col => 
    col.statistics.type === 'numeric' && 
    col.semanticType !== 'identifier'
  );
  
  for (const timeDim of timeDimensions) {
    for (const measure of measures.slice(0, 3)) {
      const aggregation = getBestAggregation(kpis, measure.name);
      
      recommendations.push({
        chartType: 'line',
        title: generateTimeSeriesTitle(measure.name, timeDim.name),
        xAxis: timeDim.name,
        yAxis: measure.name,
        aggregation,
        confidence: 0.7,
        reason: `Time dimension '${timeDim.name}' with numeric measure '${measure.name}'`,
      });
    }
  }
  
  return recommendations;
}

export function recommendBarCharts(
  profiledColumns: ProfiledColumn[],
  dimensionCandidates: DimensionCandidate[],
  measureCandidates: MeasureCandidate[],
  kpis: DiscoveredKPI[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const categoricalDimensions = profiledColumns.filter(col => isCategoricalDimension(col));
  const measures = profiledColumns.filter(col => 
    col.statistics.type === 'numeric' && 
    col.semanticType !== 'identifier'
  );
  
  for (const dim of categoricalDimensions.slice(0, 3)) {
    for (const measure of measures.slice(0, 2)) {
      const aggregation = getBestAggregation(kpis, measure.name);
      
      recommendations.push({
        chartType: 'bar',
        title: generateCategoricalTitle(measure.name, dim.name),
        xAxis: dim.name,
        yAxis: measure.name,
        aggregation,
        confidence: 0.65,
        reason: `Categorical dimension '${dim.name}' with numeric measure '${measure.name}'`,
      });
    }
  }
  
  return recommendations;
}

export function recommendColumnCharts(
  profiledColumns: ProfiledColumn[],
  dimensionCandidates: DimensionCandidate[],
  measureCandidates: MeasureCandidate[],
  kpis: DiscoveredKPI[]
): VisualizationRecommendation[] {
  const recommendations: VisualizationRecommendation[] = [];
  
  const categoricalDimensions = profiledColumns.filter(col => isCategoricalDimension(col));
  const measures = profiledColumns.filter(col => 
    col.statistics.type === 'numeric' && 
    col.semanticType !== 'identifier'
  );
  
  for (const dim of categoricalDimensions.slice(0, 3)) {
    for (const measure of measures.slice(0, 2)) {
      const aggregation = getBestAggregation(kpis, measure.name);
      
      recommendations.push({
        chartType: 'column',
        title: generateCategoricalTitle(measure.name, dim.name),
        xAxis: dim.name,
        yAxis: measure.name,
        aggregation,
        confidence: 0.65,
        reason: `Categorical dimension '${dim.name}' with numeric measure '${measure.name}'`,
      });
    }
  }
  
  return recommendations;
}
