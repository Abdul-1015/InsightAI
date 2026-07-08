import type { ColumnAnalysisInput, SemanticType } from "./types";
import { classificationRules } from "./rules";

export function classifyColumn(input: ColumnAnalysisInput): SemanticType {
  const sortedRules = [...classificationRules].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    if (rule.matcher(input)) {
      return rule.type;
    }
  }
  
  return 'unknown';
}
