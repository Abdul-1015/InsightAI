import type { DataType } from "../../upload/types";

export type SemanticType =
  | 'currency'
  | 'percentage'
  | 'quantity'
  | 'identifier'
  | 'geography'
  | 'person_name'
  | 'company_name'
  | 'email'
  | 'phone'
  | 'timeline'
  | 'boolean'
  | 'category'
  | 'text'
  | 'null'
  | 'unknown';

export interface SemanticColumn {
  name: string;
  dataType: DataType;
  semanticType: SemanticType;
  nullable: boolean;
}

export interface ColumnAnalysisInput {
  name: string;
  dataType: DataType;
  sampleValues: unknown[];
}

export interface ClassificationRule {
  type: SemanticType;
  priority: number;
  matcher: (input: ColumnAnalysisInput) => boolean;
}
