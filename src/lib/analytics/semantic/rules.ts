import type { ClassificationRule, ColumnAnalysisInput } from "./types";

const CURRENCY_SYMBOLS = ['$', '€', '£', '¥', '₹', '₽', '₩', '₪', '₫', '₱', '₡', '₦', '₴', '₸', '₲', '₠', '₢', '₣', '₤', '₥', '₧', '₨', '₩', '₪', '₫', '€', '₭', '₮', '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸', '₺', '₻', '₼', '₽', '₾', '₿'];

const CURRENCY_KEYWORDS = [
  'price', 'cost', 'amount', 'total', 'revenue', 'salary', 'wage', 'income',
  'payment', 'fee', 'charge', 'tax', 'discount', 'profit', 'loss', 'balance',
  'budget', 'expense', 'spending', 'earning', 'worth', 'value', 'rate',
  'usd', 'eur', 'gbp', 'jpy', 'inr', 'aud', 'cad', 'chf', 'cny', 'sek',
  'mxn', 'brl', 'sgd', 'hkd', 'nzd', 'zar', 'rub', 'krw', 'try', 'pln',
  'dollar', 'euro', 'pound', 'yen', 'rupee', 'real', 'franc', 'yuan',
  'currency', 'money', 'cash', 'fund', 'asset', 'liability', 'debit', 'credit'
];

const PERCENTAGE_KEYWORDS = [
  'percent', 'percentage', 'rate', 'ratio', 'proportion', 'share', 'portion',
  'growth', 'change', 'increase', 'decrease', 'margin', 'markup', 'markdown',
  'discount', 'tax', 'interest', 'dividend', 'yield', 'return', 'roi'
];

const PERCENTAGE_SYMBOLS = ['%'];

const GEOGRAPHY_KEYWORDS = [
  'country', 'state', 'province', 'region', 'city', 'town', 'village',
  'address', 'street', 'road', 'avenue', 'boulevard', 'lane', 'drive',
  'zip', 'postal', 'code', 'location', 'place', 'area', 'district',
  'county', 'territory', 'zone', 'latitude', 'longitude', 'coord',
  'geography', 'geo', 'lat', 'lng', 'long', 'gps'
];

const PERSON_KEYWORDS = [
  'name', 'first', 'last', 'full', 'user', 'customer', 'client', 'patient',
  'employee', 'staff', 'member', 'person', 'individual', 'contact',
  'author', 'creator', 'owner', 'manager', 'director', 'ceo', 'cto', 'cfo',
  'president', 'vice', 'chairman', 'founder', 'lead', 'head'
];

const COMPANY_KEYWORDS = [
  'company', 'organization', 'org', 'business', 'enterprise', 'corporation',
  'corp', 'inc', 'llc', 'ltd', 'firm', 'agency', 'institution', 'entity',
  'vendor', 'supplier', 'partner', 'client', 'customer', 'brand', 'group',
  'team', 'department', 'division', 'unit'
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

const TIMELINE_KEYWORDS = [
  'date', 'time', 'timestamp', 'datetime', 'created', 'updated', 'modified',
  'added', 'removed', 'started', 'ended', 'begin', 'finish', 'due', 'deadline',
  'schedule', 'calendar', 'year', 'month', 'day', 'hour', 'minute', 'second',
  'period', 'duration', 'interval', 'epoch', 'moment', 'instant', 'now',
  'today', 'yesterday', 'tomorrow', 'tomorrow', 'ago', 'since', 'until',
  'before', 'after', 'during', 'between'
];

const BOOLEAN_KEYWORDS = [
  'is', 'has', 'was', 'are', 'were', 'been', 'being', 'have', 'had', 'do',
  'did', 'does', 'done', 'will', 'would', 'could', 'should', 'may', 'might',
  'can', 'shall', 'must', 'need', 'able', 'available', 'enabled', 'disabled',
  'active', 'inactive', 'yes', 'no', 'true', 'false', 'on', 'off', 'ok',
  'valid', 'invalid', 'complete', 'incomplete', 'done', 'pending'
];

const CATEGORY_KEYWORDS = [
  'type', 'category', 'class', 'group', 'kind', 'sort', 'genre', 'style',
  'brand', 'model', 'version', 'level', 'grade', 'rank', 'status', 'state',
  'condition', 'quality', 'size', 'color', 'shape', 'material', 'weight',
  'height', 'width', 'length', 'depth', 'volume', 'capacity'
];

function matchesKeyword(name: string, keywords: string[]): boolean {
  const normalizedName = name.toLowerCase().replace(/[_\-\s]+/g, ' ');
  return keywords.some(keyword => normalizedName.includes(keyword));
}

function hasCurrencySymbol(values: unknown[]): boolean {
  const sample = values.slice(0, 100);
  return sample.some(v => {
    if (typeof v !== 'string') return false;
    return CURRENCY_SYMBOLS.some(symbol => v.includes(symbol));
  });
}

function hasPercentageSymbol(values: unknown[]): boolean {
  const sample = values.slice(0, 100);
  return sample.some(v => {
    if (typeof v !== 'string') return false;
    return PERCENTAGE_SYMBOLS.some(symbol => v.includes(symbol));
  });
}

function hasEmailFormat(values: unknown[]): boolean {
  const sample = values.slice(0, 100);
  const nonNullSample = sample.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullSample.length === 0) return false;
  
  const emailCount = nonNullSample.filter(v => {
    if (typeof v !== 'string') return false;
    return EMAIL_REGEX.test(v.trim());
  }).length;
  
  return emailCount / nonNullSample.length >= 0.8;
}

function hasPhoneFormat(values: unknown[]): boolean {
  const sample = values.slice(0, 100);
  const nonNullSample = sample.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullSample.length === 0) return false;
  
  const phoneCount = nonNullSample.filter(v => {
    if (typeof v !== 'string') return false;
    return PHONE_REGEX.test(v.trim().replace(/[\s\-\(\)]/g, ''));
  }).length;
  
  return phoneCount / nonNullSample.length >= 0.8;
}

function isLowCardinality(values: unknown[], threshold: number = 20): boolean {
  const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== '').map(v => String(v)));
  return uniqueValues.size <= threshold;
}

export const classificationRules: ClassificationRule[] = [
  {
    type: 'email',
    priority: 100,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, ['email', 'e-mail', 'mail']) || hasEmailFormat(input.sampleValues);
    }
  },
  {
    type: 'phone',
    priority: 95,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, ['phone', 'tel', 'mobile', 'cell', 'fax']) || hasPhoneFormat(input.sampleValues);
    }
  },
  {
    type: 'percentage',
    priority: 90,
    matcher: (input: ColumnAnalysisInput) => {
      return matchesKeyword(input.name, PERCENTAGE_KEYWORDS) || hasPercentageSymbol(input.sampleValues);
    }
  },
  {
    type: 'currency',
    priority: 85,
    matcher: (input: ColumnAnalysisInput) => {
      return matchesKeyword(input.name, CURRENCY_KEYWORDS) || hasCurrencySymbol(input.sampleValues);
    }
  },
  {
    type: 'timeline',
    priority: 80,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType === 'date') return true;
      return matchesKeyword(input.name, TIMELINE_KEYWORDS);
    }
  },
  {
    type: 'geography',
    priority: 75,
    matcher: (input: ColumnAnalysisInput) => {
      return matchesKeyword(input.name, GEOGRAPHY_KEYWORDS);
    }
  },
  {
    type: 'person_name',
    priority: 70,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, PERSON_KEYWORDS) && isLowCardinality(input.sampleValues, 50);
    }
  },
  {
    type: 'company_name',
    priority: 65,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, COMPANY_KEYWORDS) && isLowCardinality(input.sampleValues, 50);
    }
  },
  {
    type: 'boolean',
    priority: 60,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType === 'boolean') return true;
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, BOOLEAN_KEYWORDS);
    }
  },
  {
    type: 'identifier',
    priority: 55,
    matcher: (input: ColumnAnalysisInput) => {
      return matchesKeyword(input.name, ['id', 'key', 'code', 'reference', 'ref', 'uid', 'uuid', 'pk', 'fk']);
    }
  },
  {
    type: 'category',
    priority: 50,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'string') return false;
      return matchesKeyword(input.name, CATEGORY_KEYWORDS) && isLowCardinality(input.sampleValues);
    }
  },
  {
    type: 'quantity',
    priority: 45,
    matcher: (input: ColumnAnalysisInput) => {
      if (input.dataType !== 'number') return false;
      return matchesKeyword(input.name, ['count', 'number', 'quantity', 'amount', 'volume', 'total', 'sum']);
    }
  },
  {
    type: 'text',
    priority: 10,
    matcher: (input: ColumnAnalysisInput) => {
      return input.dataType === 'string';
    }
  },
  {
    type: 'unknown',
    priority: 0,
    matcher: () => true
  }
];
