import { CATEGORIA_IDS } from './categorias';
import { parseEmporios, parseMercado, parseReceitas } from '../lib/schema';
import emporiosRaw from './emporios.json';
import marketRaw from './market.json';
import recipesRaw from './recipes.json';

/** Dados validados em runtime — entradas fora do schema são descartadas (com aviso no console). */
/** Agrupadas pela ordem das categorias (sort estável preserva a ordem dentro de cada uma). */
export const RECEITAS = parseReceitas(recipesRaw).sort(
  (a, b) => CATEGORIA_IDS.indexOf(a.categoria) - CATEGORIA_IDS.indexOf(b.categoria),
);
export const MERCADO = parseMercado(marketRaw);
export const EMPORIOS = parseEmporios(emporiosRaw);

export const findReceita = (id: string) => RECEITAS.find((r) => r.id === id);
