import type { KPIReason } from "./types";
import type { ProfiledColumn } from "../profile/types";

const REASON_WEIGHTS: Record<KPIReason['type'], number> = {
  semantic_type: 0.3,
  measure_candidate: 0.25,
  data_quality: 0.2,
  distribution: 0.15,
  cardinality: 0.1,
};

function calculateBaseConfidence(col: ProfiledColumn): number {
  let confidence = 0.5;
  
  if (col.statistics.type === 'numeric') {
    const stats = col.statistics.stats;
    
    if (stats.nullPercent < 5) {
      confidence += 0.1;
    } else if (stats.nullPercent < 20) {
      confidence += 0.05;
    } else if (stats.nullPercent >= 50) {
      confidence -= 0.2;
    }
    
    if (stats.uniquePercent > 50) {
      confidence += 0.1;
    }
    
    if (stats.mean > 0) {
      confidence += 0.05;
    }
    
    if (stats.stdDev > 0) {
      confidence += 0.05;
    }
  }
  
  return Math.min(Math.max(confidence, 0.1), 0.9);
}

function calculateReasonBonus(reasons: KPIReason[]): number {
  let bonus = 0;
  
  for (const reason of reasons) {
    const weight = REASON_WEIGHTS[reason.type] || 0;
    bonus += weight * 0.2;
  }
  
  return Math.min(bonus, 0.4);
}

export function calculateConfidence(
  col: ProfiledColumn,
  reasons: KPIReason[]
): number {
  const baseConfidence = calculateBaseConfidence(col);
  const reasonBonus = calculateReasonBonus(reasons);
  
  const confidence = baseConfidence + reasonBonus;
  
  return Math.round(Math.min(Math.max(confidence, 0.1), 1.0) * 100) / 100;
}
