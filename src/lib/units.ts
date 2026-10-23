import { CONVERSIONS } from '../data/conversions';
import type { Ingrediente, UnitMode } from '../types';

/* Motor de conversão bidirecional: grama/mililitro <-> medidas caseiras. Funções puras. */

export type MetricUnit = 'g' | 'ml';
export type HouseholdKey = 'xicara' | 'colher_sopa' | 'colher_cha' | 'punhado';

export interface Conversion {
  metric: MetricUnit;
  unit: HouseholdKey;
  /** g ou ml contidos em 1 medida caseira */
  perUnit: number;
  /** [singular, plural] — ex.: ['cheia', 'cheias'] */
  qualifier?: [string, string];
}

export const HOUSEHOLD_LABELS: Record<HouseholdKey, [string, string]> = {
  xicara: ['xícara', 'xícaras'],
  colher_sopa: ['colher de sopa', 'colheres de sopa'],
  colher_cha: ['colher de chá', 'colheres de chá'],
  punhado: ['punhado', 'punhados'],
};

export const metricToHousehold = (conv: Conversion, metric: number): number => metric / conv.perUnit;
export const householdToMetric = (conv: Conversion, household: number): number => household * conv.perUnit;

export interface ResolvedAmount {
  metric: { value: number; unit: MetricUnit } | null;
  household: { value: number; conv: Conversion } | null;
  /** apenas quando não há como converter (ex.: "2 unidades") */
  fixed: { value: number; unidade: string } | null;
}

/** Descobre qual medida caseira o texto da unidade expressa (ou null se não for uma). */
function householdKeyOf(base: string): HouseholdKey | null {
  if (/^colher(es)? de sopa/.test(base)) return 'colher_sopa';
  if (/^colher(es)? de chá/.test(base)) return 'colher_cha';
  if (/^xícaras?/.test(base)) return 'xicara';
  if (/^punhados?/.test(base)) return 'punhado';
  return null;
}

/** Calcula todas as representações possíveis de um ingrediente para o fator de porções informado. */
export function resolveIngredient(ing: Ingrediente, factor: number): ResolvedAmount {
  const value = ing.quantidade_base * factor;
  const conv: Conversion | undefined = CONVERSIONS[ing.nome];
  const base = ing.unidade.trim().toLowerCase();

  if (base === 'g' || base === 'ml') {
    return {
      metric: { value, unit: base },
      household: conv && conv.metric === base ? { value: metricToHousehold(conv, value), conv } : null,
      fixed: null,
    };
  }
  if (conv && householdKeyOf(base) === conv.unit) {
    return {
      metric: { value: householdToMetric(conv, value), unit: conv.metric },
      household: { value, conv },
      fixed: null,
    };
  }
  return { metric: null, household: null, fixed: { value, unidade: ing.unidade } };
}

export const hasConversion = (nome: string): boolean => nome in CONVERSIONS;

/* ---------- formatação ---------- */

const numberFmt = (max: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: max });
const FRACTIONS: Record<number, string> = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' };

export function formatMetric(value: number, unit: MetricUnit): string {
  let v: number;
  if (value < 1) v = Math.round(value * 10) / 10;
  else if (value < 10) v = Math.round(value * 2) / 2;
  else if (value < 100) v = Math.round(value);
  else v = Math.round(value / 5) * 5;
  return `${numberFmt(1).format(v)} ${unit}`;
}

/** 2,5 -> "2½"; arredonda ao quarto mais próximo. Retorna também se é singular. */
function quarters(value: number): { text: string; singular: boolean; zero: boolean } {
  const q = Math.round(value * 4) / 4;
  const whole = Math.floor(q);
  const frac = FRACTIONS[q - whole] ?? '';
  const text = whole > 0 ? `${whole}${frac}` : frac;
  return { text, singular: q <= 1, zero: q === 0 };
}

export function formatHousehold(value: number, conv: Conversion): string {
  const { text, singular, zero } = quarters(value);
  if (zero) return conv.unit === 'colher_cha' ? 'uma pitada' : `um fio (≈ ${formatMetric(householdToMetric(conv, value), conv.metric)})`;
  const [one, many] = HOUSEHOLD_LABELS[conv.unit];
  const q = conv.qualifier ? ` ${singular ? conv.qualifier[0] : conv.qualifier[1]}` : '';
  return `${text} ${singular ? one : many}${q}`;
}

const PLURAL_PAIRS: Array<[string, string]> = [
  ['unidade', 'unidades'],
  ['talo inteiro', 'talos inteiros'],
  ['tigela pequena', 'tigelas pequenas'],
  ['dente', 'dentes'],
  ['colher de sopa', 'colheres de sopa'],
  ['colher de chá', 'colheres de chá'],
  ['pacote', 'pacotes'],
  ['xícara', 'xícaras'],
  ['camarão', 'camarões'],
  ['punhado', 'punhados'],
  ['pedaço', 'pedaços'],
  ['pitada', 'pitadas'],
  ['porção', 'porções'],
  ['filé', 'filés'],
  ['tira de 15 cm', 'tiras de 15 cm'],
  ['gomo', 'gomos'],
  ['bife', 'bifes'],
  ['colher de chá de amido', 'colheres de chá de amido'],
];

export function formatFixed(value: number, unidade: string): string {
  if (value === 0) return unidade; // convenção: quantidade 0 + unidade "a gosto"
  const { text, singular } = quarters(value);
  const pair = PLURAL_PAIRS.find(([s, p]) => s === unidade || p === unidade);
  const label = pair ? (singular ? pair[0] : pair[1]) : unidade;
  return `${text || '¼'} ${label}`;
}

export interface AmountDisplay {
  primary: string;
  secondary: string | null;
}

/** Texto final de um ingrediente para o modo de unidade ativo. Só usa o que existe — sem layout shift. */
export function displayAmount(ing: Ingrediente, factor: number, mode: UnitMode): AmountDisplay {
  const r = resolveIngredient(ing, factor);
  const metric = r.metric ? formatMetric(r.metric.value, r.metric.unit) : null;
  const household = r.household ? formatHousehold(r.household.value, r.household.conv) : null;

  if (!metric && !household) {
    return { primary: r.fixed ? formatFixed(r.fixed.value, r.fixed.unidade) : '—', secondary: null };
  }
  if (mode === 'household' && household) return { primary: household, secondary: metric ? `≈ ${metric}` : null };
  if (mode === 'metric' && metric) return { primary: metric, secondary: household ? `≈ ${household}` : null };
  return { primary: (metric ?? household)!, secondary: null };
}

/** "1,5" ou "1.5" -> 1.5 ; inválido/negativo -> null */
export function parseDecimal(text: string): number | null {
  const n = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null;
}

export const formatInputNumber = (n: number): string => numberFmt(2).format(n).replace(/\./g, '');
