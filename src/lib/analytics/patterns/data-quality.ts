import type {
  MissingDataPattern,
  HighUniquenessPattern,
  LowCardinalityPattern,
  ConstantValuePattern,
} from "./types";
import type { ProfiledColumn } from "../profile/types";

function getMissingSeverity(percent: number): 'high' | 'moderate' | 'low' {
  if (percent >= 30) return 'high';
  if (percent >= 10) return 'moderate';
  return 'low';
}

export function detectMissingData(
  profiledColumns: ProfiledColumn[]
): MissingDataPattern[] {
  const patterns: MissingDataPattern[] = [];
  
  for (const col of profiledColumns) {
    let missingPercent = 0;
    
    if (col.statistics.type === 'numeric') {
      missingPercent = col.statistics.stats.nullPercent;
    } else if (col.statistics.type === 'categorical') {
      missingPercent = col.statistics.stats.nullPercent;
    } else if (col.statistics.type === 'boolean') {
      missingPercent = col.statistics.stats.nullPercent;
    } else if (col.statistics.type === 'date') {
      missingPercent = col.statistics.stats.nullPercent;
    } else if (col.statistics.type === 'null') {
      missingPercent = col.statistics.stats.nullPercent;
    }
    
    if (missingPercent >= 5) {
      patterns.push({
        columnName: col.name,
        missingCount: Math.round((missingPercent / 100) * col.totalCount),
        missingPercent,
        severity: getMissingSeverity(missingPercent),
      });
    }
  }
  
  return patterns.sort((a, b) => b.missingPercent - a.missingPercent);
}

export function detectHighUniqueness(
  profiledColumns: ProfiledColumn[]
): HighUniquenessPattern[] {
  const patterns: HighUniquenessPattern[] = [];
  
  for (const col of profiledColumns) {
    let uniquePercent = 0;
    
    if (col.statistics.type === 'numeric') {
      uniquePercent = col.statistics.stats.uniquePercent;
    } else if (col.statistics.type === 'categorical') {
      uniquePercent = col.statistics.stats.uniquePercent;
    }
    
    if (uniquePercent >= 95) {
      patterns.push({
        columnName: col.name,
        uniquePercent,
        isCandidateKey: uniquePercent === 100,
      });
    }
  }
  
  return patterns.sort((a, b) => b.uniquePercent - a.uniquePercent);
}

function getTopValuesFromCategorical(col: ProfiledColumn): Array<{ value: string; count: number }> {
  if (col.statistics.type === 'categorical') {
    return col.statistics.stats.topValues.slice(0, 5);
  }
  return [];
}

export function detectLowCardinality(
  profiledColumns: ProfiledColumn[]
): LowCardinalityPattern[] {
  const patterns: LowCardinalityPattern[] = [];
  
  for (const col of profiledColumns) {
    if (col.semanticType === 'boolean' || col.semanticType === 'null') continue;
    
    let uniqueCount = 0;
    let uniquePercent = 0;
    
    if (col.statistics.type === 'numeric') {
      uniqueCount = col.statistics.stats.uniqueCount;
      uniquePercent = col.statistics.stats.uniquePercent;
    } else if (col.statistics.type === 'categorical') {
      uniqueCount = col.statistics.stats.uniqueCount;
      uniquePercent = col.statistics.stats.uniquePercent;
    } else if (col.statistics.type === 'date') {
      continue;
    }
    
    if (uniquePercent <= 10 && uniqueCount <= 20 && uniqueCount > 1) {
      const topValues = getTopValuesFromCategorical(col);
      
      patterns.push({
        columnName: col.name,
        uniqueCount,
        uniquePercent,
        topValues,
      });
    }
  }
  
  return patterns.sort((a, b) => a.uniqueCount - b.uniqueCount);
}

export function detectConstantValues(
  profiledColumns: ProfiledColumn[]
): ConstantValuePattern[] {
  const patterns: ConstantValuePattern[] = [];
  
  for (const col of profiledColumns) {
    if (col.semanticType === 'null') continue;
    
    let uniqueCount = 0;
    let mostFrequentValue: string | null = null;
    
    if (col.statistics.type === 'numeric') {
      uniqueCount = col.statistics.stats.uniqueCount;
    } else if (col.statistics.type === 'categorical') {
      uniqueCount = col.statistics.stats.uniqueCount;
      mostFrequentValue = col.statistics.stats.mostFrequentValue;
    } else if (col.statistics.type === 'boolean') {
      continue;
    } else if (col.statistics.type === 'date') {
      continue;
    }
    
    if (uniqueCount <= 1) {
      patterns.push({
        columnName: col.name,
        constantValue: mostFrequentValue || 'N/A',
        uniqueCount,
      });
    }
  }
  
  return patterns;
}
