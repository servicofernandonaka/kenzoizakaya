import { CATEGORIA_IDS } from '../data/categorias';
import type { CookNote, ChecksByRecipe, Emporio, NotesByRecipe, Prefs, ProdutoMercado, Receita } from '../types';

/* Validadores em runtime: nenhum dado externo (JSON ou LocalStorage) entra na UI sem passar por aqui. */

type Rec = Record<string, unknown>;

export const isRecord = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const optStr = (v: unknown) => v === undefined || isStr(v);
const optNum = (v: unknown) => v === undefined || isNum(v);

const REGIOES = ['liberdade', 'online', 'bairros'];

function isIngrediente(v: unknown): boolean {
  return (
    isRecord(v) && isStr(v.nome) && isNum(v.quantidade_base) && v.quantidade_base >= 0 && isStr(v.unidade) && optStr(v.nota) &&
    (v.escala === undefined || typeof v.escala === 'boolean')
  );
}

function isPasso(v: unknown): boolean {
  return (
    isRecord(v) &&
    isNum(v.ordem) &&
    isStr(v.instrucao) &&
    optNum(v.timer_segundos) &&
    optStr(v.alerta_kenzo) &&
    optStr(v.dica_tomesan)
  );
}

export function isReceita(v: unknown): v is Receita {
  return (
    isRecord(v) &&
    isStr(v.id) &&
    isStr(v.titulo_pt) &&
    isStr(v.titulo_jp) &&
    isStr(v.categoria) &&
    CATEGORIA_IDS.includes(v.categoria) &&
    isStr(v.subtitulo) &&
    isNum(v.tempo_minutos) &&
    isNum(v.rendimento_base_porcoes) &&
    v.rendimento_base_porcoes > 0 &&
    Array.isArray(v.ingredientes) &&
    v.ingredientes.every(isIngrediente) &&
    Array.isArray(v.passos) &&
    v.passos.every(isPasso)
  );
}

function parseList<T>(raw: unknown, guard: (v: unknown) => v is T, label: string): T[] {
  if (!Array.isArray(raw)) {
    console.warn(`[schema] ${label}: esperado um array.`);
    return [];
  }
  const ok: T[] = [];
  raw.forEach((item, i) => {
    if (guard(item)) ok.push(item);
    else console.warn(`[schema] ${label}[${i}] descartado: formato inválido.`);
  });
  return ok;
}

export const parseReceitas = (raw: unknown): Receita[] =>
  parseList(raw, isReceita, 'recipes.json').map((r) => ({
    ...r,
    passos: [...r.passos].sort((a, b) => a.ordem - b.ordem),
  }));

const isProduto = (v: unknown): v is ProdutoMercado =>
  isRecord(v) && isStr(v.ingrediente) && isStr(v.termo) && isStr(v.motivo);
export const parseMercado = (raw: unknown): ProdutoMercado[] => parseList(raw, isProduto, 'market.json');

const isEmporio = (v: unknown): v is Emporio =>
  isRecord(v) &&
  isStr(v.id) &&
  isStr(v.nome) &&
  isStr(v.regiao) &&
  REGIOES.includes(v.regiao) &&
  isStr(v.descricao) &&
  Array.isArray(v.tags) &&
  v.tags.every(isStr) &&
  optStr(v.mapsQuery);
export const parseEmporios = (raw: unknown): Emporio[] => parseList(raw, isEmporio, 'emporios.json');

/* ---- LocalStorage ---- */

export const isPrefs = (v: unknown): v is Prefs =>
  isRecord(v) && (v.unitMode === 'metric' || v.unitMode === 'household') && (v.theme === 'dark' || v.theme === 'washi');

export const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

const isNote = (v: unknown): v is CookNote => isRecord(v) && isStr(v.id) && isStr(v.criadoEm) && isStr(v.texto);

export const isNotes = (v: unknown): v is NotesByRecipe =>
  isRecord(v) && Object.values(v).every((list) => Array.isArray(list) && list.every(isNote));

export const isChecks = (v: unknown): v is ChecksByRecipe => isRecord(v) && Object.values(v).every(isStringArray);
