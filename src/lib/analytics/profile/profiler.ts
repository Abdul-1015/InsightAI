import type { SemanticColumn } from "../semantic/types";
import type {
  DatasetStatProfile,
  ProfiledColumn,
  ProfileInput,
  ColumnStatistics,
} from "./types";
import { profileNumericColumn } from "./numeric";
import { profileCategoricalColumn } from "./categorical";
import { profileBooleanColumn } from "./boolean";
import { profileDateColumn } from "./date";
import { countNulls, calculateNullPercent } from "./utils";

function isNumericSemanticType(semanticType: string): boolean {
  return ['currency', 'percentage', 'quantity'].includes(semanticType);
}

function isCategoricalSemanticType(semanticType: string): boolean {
  return ['category', 'text', 'geography', 'person_name', 'company_name', 'email', 'phone', 'identifier'].includes(semanticType);
}

function isBooleanSemanticType(semanticType: string): boolean {
  return semanticType === 'boolean';
}

function isDateSemanticType(semanticType: string): boolean {
  return semanticType === 'timeline';
}

function profileNullColumn(input: ProfileInput): ColumnStatistics {
  const nullCount = countNulls(input.values);
  const nullPercent = calculateNullPercent(nullCount, input.totalCount);
  
  return {
    type: 'null',
    stats: {
      nullCount,
      nullPercent,
    },
  };
}

function profileColumn(
  semantic: SemanticColumn,
  rows: Record<string, unknown>[]
): ProfiledColumn {
  const values = rows.map(row => row[semantic.name]);
  const totalCount = rows.length;
  
  const input: ProfileInput = {
    name: semantic.name,
    semanticType: semantic.semanticType,
    values,
    totalCount,
  };
  
  let statistics: ColumnStatistics;
  
  if (semantic.semanticType === 'null') {
    statistics = profileNullColumn(input);
  } else if (isNumericSemanticType(semantic.semanticType)) {
    statistics = { type: 'numeric', stats: profileNumericColumn(input) };
  } else if (isBooleanSemanticType(semantic.semanticType)) {
    statistics = { type: 'boolean', stats: profileBooleanColumn(input) };
  } else if (isDateSemanticType(semantic.semanticType)) {
    statistics = { type: 'date', stats: profileDateColumn(input) };
  } else if (isCategoricalSemanticType(semantic.semanticType)) {
    statistics = { type: 'categorical', stats: profileCategoricalColumn(input) };
  } else {
    statistics = { type: 'categorical', stats: profileCategoricalColumn(input) };
  }
  
  return {
    name: semantic.name,
    semanticType: semantic.semanticType,
    totalCount,
    statistics,
  };
}

export function profileDataset(
  columns: { name: string }[],
  rows: Record<string, unknown>[],
  semanticColumns: SemanticColumn[]
): DatasetStatProfile {
  const semanticMap = new Map<string, SemanticColumn>();
  for (const sc of semanticColumns) {
    semanticMap.set(sc.name, sc);
  }
  
  const profiledColumns: ProfiledColumn[] = [];
  
  for (const column of columns) {
    const semantic = semanticMap.get(column.name);
    
    if (semantic) {
      const profiled = profileColumn(semantic, rows);
      profiledColumns.push(profiled);
    }
  }
  
  return {
    columns: profiledColumns,
    totalRows: rows.length,
    profiledAt: new Date(),
  };
}
