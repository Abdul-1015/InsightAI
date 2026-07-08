import type { DimensionCandidate, MeasureCandidate } from "./types";
import type { SemanticType } from "../semantic/types";
import type { ProfiledColumn } from "../profile/types";

const DIMENSION_KEYWORDS = [
  'country', 'region', 'city', 'state', 'province', 'location', 'area',
  'category', 'type', 'group', 'class', 'segment', 'tier', 'level',
  'department', 'division', 'team', 'unit', 'branch', 'store', 'shop',
  'product', 'item', 'sku', 'model', 'brand', 'make', 'vendor',
  'customer', 'client', 'user', 'member', 'account', 'subscriber',
  'date', 'month', 'quarter', 'year', 'week', 'day', 'period',
  'status', 'state', 'condition', 'stage', 'phase',
  'gender', 'age', 'generation', 'cohort',
  'source', 'channel', 'medium', 'campaign',
  'platform', 'device', 'browser', 'os',
];

const MEASURE_KEYWORDS = [
  'revenue', 'sales', 'income', 'profit', 'loss', 'earnings',
  'price', 'cost', 'expense', 'spending', 'budget',
  'quantity', 'amount', 'volume', 'count', 'total', 'sum',
  'growth', 'change', 'increase', 'decrease', 'delta',
  'rate', 'ratio', 'percentage', 'percent', 'proportion',
  'average', 'mean', 'median', 'min', 'max', 'std',
  'orders', 'transactions', 'purchases', 'payments',
  'visits', 'views', 'clicks', 'impressions', 'conversions',
  'subscribers', 'users', 'customers', 'members',
  'inventory', 'stock', 'units', 'items',
  'hours', 'minutes', 'seconds', 'duration', 'time',
];

const DIMENSION_SEMANTIC_TYPES: SemanticType[] = [
  'geography',
  'category',
  'timeline',
  'boolean',
];

const MEASURE_SEMANTIC_TYPES: SemanticType[] = [
  'currency',
  'percentage',
  'quantity',
];

function matchesKeywords(name: string, keywords: string[]): boolean {
  const normalizedName = name.toLowerCase().replace(/[_\-\s]+/g, ' ');
  return keywords.some(keyword => normalizedName.includes(keyword));
}

function getUniqueCount(col: ProfiledColumn): number {
  if (col.statistics.type === 'numeric') {
    return col.statistics.stats.uniqueCount;
  }
  if (col.statistics.type === 'categorical') {
    return col.statistics.stats.uniqueCount;
  }
  return 0;
}

function getUniquePercent(col: ProfiledColumn): number {
  if (col.statistics.type === 'numeric') {
    return col.statistics.stats.uniquePercent;
  }
  if (col.statistics.type === 'categorical') {
    return col.statistics.stats.uniquePercent;
  }
  return 0;
}

export function detectDimensionCandidates(
  profiledColumns: ProfiledColumn[]
): DimensionCandidate[] {
  const candidates: DimensionCandidate[] = [];
  
  for (const col of profiledColumns) {
    if (col.semanticType === 'null' || col.semanticType === 'unknown') continue;
    
    const reasons: string[] = [];
    
    if (DIMENSION_SEMANTIC_TYPES.includes(col.semanticType)) {
      reasons.push(`semantic type: ${col.semanticType}`);
    }
    
    if (matchesKeywords(col.name, DIMENSION_KEYWORDS)) {
      reasons.push('name matches dimension keywords');
    }
    
    const uniquePercent = getUniquePercent(col);
    const uniqueCount = getUniqueCount(col);
    
    if (uniquePercent <= 50 && uniqueCount <= 100 && uniqueCount > 1) {
      reasons.push(`low cardinality (${uniqueCount} unique values)`);
    }
    
    if (reasons.length >= 2) {
      candidates.push({
        columnName: col.name,
        semanticType: col.semanticType,
        uniqueCount,
        reasons,
      });
    }
  }
  
  return candidates.sort((a, b) => b.reasons.length - a.reasons.length);
}

export function detectMeasureCandidates(
  profiledColumns: ProfiledColumn[]
): MeasureCandidate[] {
  const candidates: MeasureCandidate[] = [];
  
  for (const col of profiledColumns) {
    if (col.semanticType === 'null' || col.semanticType === 'unknown') continue;
    if (col.statistics.type !== 'numeric') continue;
    
    const reasons: string[] = [];
    
    if (MEASURE_SEMANTIC_TYPES.includes(col.semanticType)) {
      reasons.push(`semantic type: ${col.semanticType}`);
    }
    
    if (matchesKeywords(col.name, MEASURE_KEYWORDS)) {
      reasons.push('name matches measure keywords');
    }
    
    const stats = col.statistics.stats;
    if (stats.min >= 0 && stats.mean > 0) {
      reasons.push('non-negative values');
    }
    
    if (reasons.length >= 2) {
      candidates.push({
        columnName: col.name,
        semanticType: col.semanticType,
        reasons,
      });
    }
  }
  
  return candidates.sort((a, b) => b.reasons.length - a.reasons.length);
}
