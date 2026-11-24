import { CONVERSIONS } from '../data/conversions';
import type { Receita, ShoppingEntry, UnitMode } from '../types';
import { formatFixed, formatHousehold, formatMetric, metricToHousehold, resolveIngredient, type Conversion, type MetricUnit } from './units';

export interface ShoppingRow {
  /** chave estável: `nome|unidade` */
  key: string;
  nome: string;
  metric: { value: number; unit: MetricUnit } | null;
  fixed: { value: number; unidade: string } | null;
  conv?: Conversion;
  /** títulos curtos das receitas que usam o ingrediente */
  usadoEm: string[];
}

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });
const shortTitle = (r: Receita) => r.titulo_pt.split(' (')[0];

/**
 * Junta os ingredientes das receitas escolhidas somando o que é igual (mesmo nome e mesma unidade).
 * Ingredientes que não escalam (óleo de fritura) não são somados: vale o maior volume, pois o óleo é reaproveitado.
 * A água não entra na lista: não se compra.
 */
export function buildShoppingList(entries: ShoppingEntry[], receitas: Receita[]): ShoppingRow[] {
  const rows = new Map<string, ShoppingRow & { max: boolean }>();

  for (const e of entries) {
    const r = receitas.find((x) => x.id === e.id);
    if (!r) continue;
    const factor = e.porcoes / r.rendimento_base_porcoes;

    for (const ing of r.ingredientes) {
      if (/^água/i.test(ing.nome)) continue;
      const res = resolveIngredient(ing, factor);
      const unit = res.metric ? res.metric.unit : (res.fixed?.unidade ?? '');
      const key = `${ing.nome}|${unit}`;
      const row = rows.get(key) ?? { key, nome: ing.nome, metric: null, fixed: null, conv: CONVERSIONS[ing.nome], usadoEm: [], max: ing.escala === false };
      if (res.metric) {
        const cur = row.metric?.value ?? 0;
        row.metric = { unit: res.metric.unit, value: row.max ? Math.max(cur, res.metric.value) : cur + res.metric.value };
      } else if (res.fixed) {
        const cur = row.fixed?.value ?? 0;
        row.fixed = { unidade: res.fixed.unidade, value: row.max ? Math.max(cur, res.fixed.value) : cur + res.fixed.value };
      }
      const t = shortTitle(r);
      if (!row.usadoEm.includes(t)) row.usadoEm.push(t);
      rows.set(key, row);
    }
  }
  return [...rows.values()].sort((a, b) => collator.compare(a.nome, b.nome));
}

/** Texto da quantidade conforme o sistema de medidas escolhido (balança x medidas caseiras). */
export function rowAmount(row: ShoppingRow, mode: UnitMode): { primary: string; secondary: string | null } {
  const metric = row.metric ? formatMetric(row.metric.value, row.metric.unit) : null;
  const household =
    row.metric && row.conv && row.conv.metric === row.metric.unit ? formatHousehold(metricToHousehold(row.conv, row.metric.value), row.conv) : null;
  if (!metric) return { primary: row.fixed ? formatFixed(row.fixed.value, row.fixed.unidade) : '—', secondary: null };
  if (mode === 'household' && household) return { primary: household, secondary: `≈ ${metric}` };
  return { primary: metric, secondary: household ? `≈ ${household}` : null };
}

/** Lista em texto puro, pronta para colar no WhatsApp ou nas notas do celular. */
export function shoppingText(rows: ShoppingRow[], marcados: string[], mode: UnitMode): string {
  const lines = rows
    .filter((r) => !marcados.includes(r.key))
    .map((r) => `- ${rowAmount(r, mode).primary} · ${r.nome}`);
  return ['Lista de compras · Izakaya do Kenzō', '', ...lines].join('\n');
}
