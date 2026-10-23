import { parseEmporios, parseMercado, parseReceitas } from '../lib/schema';
import emporiosRaw from './emporios.json';
import marketRaw from './market.json';
import recipesRaw from './recipes.json';

/** Dados validados em runtime — entradas fora do schema são descartadas (com aviso no console). */
export const RECEITAS = parseReceitas(recipesRaw);
export const MERCADO = parseMercado(marketRaw);
export const EMPORIOS = parseEmporios(emporiosRaw);

export const findReceita = (id: string) => RECEITAS.find((r) => r.id === id);
