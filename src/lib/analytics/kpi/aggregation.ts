import type { AggregationType, KPIReason } from "./types";
import type { SemanticType } from "../semantic/types";
import type { ProfiledColumn } from "../profile/types";

const SUM_AGGREGATION_SEMANTIC_TYPES: SemanticType[] = [
  'currency',
  'quantity',
  'percentage',
];

const AVG_AGGREGATION_SEMANTIC_TYPES: SemanticType[] = [
  'currency',
  'quantity',
  'percentage',
];

const COUNT_AGGREGATION_SEMANTIC_TYPES: SemanticType[] = [
  'category',
  'text',
  'geography',
  'person_name',
  'company_name',
  'boolean',
];

const MIN_MAX_AGGREGATION_SEMANTIC_TYPES: SemanticType[] = [
  'currency',
  'quantity',
  'percentage',
  'timeline',
];

const SUM_KEYWORDS = [
  'revenue', 'sales', 'income', 'profit', 'earnings',
  'price', 'cost', 'expense', 'spending', 'budget',
  'amount', 'total', 'sum', 'value',
];

const AVG_KEYWORDS = [
  'price', 'cost', 'rate', 'score', 'rating',
  'average', 'mean', 'median',
  'salary', 'wage', 'income',
];

const COUNT_KEYWORDS = [
  'count', 'number', 'total', 'quantity',
  'orders', 'transactions', 'purchases',
  'users', 'customers', 'members', 'subscribers',
  'visits', 'views', 'clicks',
];

const MIN_KEYWORDS = [
  'min', 'minimum', 'lowest', 'earliest', 'first',
  'start', 'begin', 'floor',
];

const MAX_KEYWORDS = [
  'max', 'maximum', 'highest', 'latest', 'last',
  'end', 'finish', 'ceiling', 'peak',
];

function matchesKeywords(name: string, keywords: string[]): boolean {
  const normalizedName = name.toLowerCase().replace(/[_\-\s]+/g, ' ');
  return keywords.some(keyword => normalizedName.includes(keyword));
}

function getSemanticTypeReasons(semanticType: SemanticType): KPIReason[] {
  const reasons: KPIReason[] = [];
  
  if (SUM_AGGREGATION_SEMANTIC_TYPES.includes(semanticType)) {
    reasons.push({
      type: 'semantic_type',
      description: `Semantic type '${semanticType}' is suitable for SUM aggregation`,
    });
  }
  
  if (AVG_AGGREGATION_SEMANTIC_TYPES.includes(semanticType)) {
    reasons.push({
      type: 'semantic_type',
      description: `Semantic type '${semanticType}' is suitable for AVG aggregation`,
    });
  }
  
  if (COUNT_AGGREGATION_SEMANTIC_TYPES.includes(semanticType)) {
    reasons.push({
      type: 'semantic_type',
      description: `Semantic type '${semanticType}' is suitable for COUNT aggregation`,
    });
  }
  
  if (MIN_MAX_AGGREGATION_SEMANTIC_TYPES.includes(semanticType)) {
    reasons.push({
      type: 'semantic_type',
      description: `Semantic type '${semanticType}' is suitable for MIN/MAX aggregation`,
    });
  }
  
  return reasons;
}

function getKeywordReasons(columnName: string): KPIReason[] {
  const reasons: KPIReason[] = [];
  
  if (matchesKeywords(columnName, SUM_KEYWORDS)) {
    reasons.push({
      type: 'measure_candidate',
      description: `Column name matches SUM keywords`,
    });
  }
  
  if (matchesKeywords(columnName, AVG_KEYWORDS)) {
    reasons.push({
      type: 'measure_candidate',
      description: `Column name matches AVG keywords`,
    });
  }
  
  if (matchesKeywords(columnName, COUNT_KEYWORDS)) {
    reasons.push({
      type: 'measure_candidate',
      description: `Column name matches COUNT keywords`,
    });
  }
  
  if (matchesKeywords(columnName, MIN_KEYWORDS)) {
    reasons.push({
      type: 'measure_candidate',
      description: `Column name matches MIN keywords`,
    });
  }
  
  if (matchesKeywords(columnName, MAX_KEYWORDS)) {
    reasons.push({
      type: 'measure_candidate',
      description: `Column name matches MAX keywords`,
    });
  }
  
  return reasons;
}

function getDataQualityReasons(col: ProfiledColumn): KPIReason[] {
  const reasons: KPIReason[] = [];
  
  if (col.statistics.type === 'numeric') {
    const stats = col.statistics.stats;
    
    if (stats.nullPercent < 5) {
      reasons.push({
        type: 'data_quality',
        description: `Low missing data (${stats.nullPercent}% null)`,
      });
    }
    
    if (stats.uniquePercent > 50) {
      reasons.push({
        type: 'cardinality',
        description: `High uniqueness (${stats.uniquePercent}%)`,
      });
    }
  }
  
  return reasons;
}

function getDistributionReasons(col: ProfiledColumn): KPIReason[] {
  const reasons: KPIReason[] = [];
  
  if (col.statistics.type === 'numeric') {
    const stats = col.statistics.stats;
    
    if (stats.mean > 0) {
      reasons.push({
        type: 'distribution',
        description: `Positive mean value (${stats.mean})`,
      });
    }
    
    if (stats.stdDev > 0) {
      reasons.push({
        type: 'distribution',
        description: `Non-zero standard deviation (${stats.stdDev})`,
      });
    }
  }
  
  return reasons;
}

export function determineBestAggregation(
  col: ProfiledColumn,
  columnName: string
): { aggregation: AggregationType; reasons: KPIReason[] } {
  const allReasons: KPIReason[] = [];
  const semanticReasons = getSemanticTypeReasons(col.semanticType);
  const keywordReasons = getKeywordReasons(columnName);
  const dataQualityReasons = getDataQualityReasons(col);
  const distributionReasons = getDistributionReasons(col);
  
  allReasons.push(...semanticReasons, ...keywordReasons, ...dataQualityReasons, ...distributionReasons);
  
  const aggregationScores: Record<AggregationType, number> = {
    SUM: 0,
    AVG: 0,
    COUNT: 0,
    MIN: 0,
    MAX: 0,
  };
  
  if (SUM_AGGREGATION_SEMANTIC_TYPES.includes(col.semanticType)) {
    aggregationScores.SUM += 3;
  }
  
  if (matchesKeywords(columnName, SUM_KEYWORDS)) {
    aggregationScores.SUM += 2;
  }
  
  if (AVG_AGGREGATION_SEMANTIC_TYPES.includes(col.semanticType)) {
    aggregationScores.AVG += 3;
  }
  
  if (matchesKeywords(columnName, AVG_KEYWORDS)) {
    aggregationScores.AVG += 2;
  }
  
  if (COUNT_AGGREGATION_SEMANTIC_TYPES.includes(col.semanticType)) {
    aggregationScores.COUNT += 3;
  }
  
  if (matchesKeywords(columnName, COUNT_KEYWORDS)) {
    aggregationScores.COUNT += 2;
  }
  
  if (MIN_MAX_AGGREGATION_SEMANTIC_TYPES.includes(col.semanticType)) {
    aggregationScores.MIN += 2;
    aggregationScores.MAX += 2;
  }
  
  if (matchesKeywords(columnName, MIN_KEYWORDS)) {
    aggregationScores.MIN += 2;
  }
  
  if (matchesKeywords(columnName, MAX_KEYWORDS)) {
    aggregationScores.MAX += 2;
  }
  
  let bestAggregation: AggregationType = 'SUM';
  let bestScore = 0;
  
  for (const [aggregation, score] of Object.entries(aggregationScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestAggregation = aggregation as AggregationType;
    }
  }
  
  return {
    aggregation: bestAggregation,
    reasons: allReasons,
  };
}
