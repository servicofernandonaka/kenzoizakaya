/* Tipos que espelham exatamente o schema dos JSON (recipes.json, market.json, emporios.json). */

export type Categoria = 'shirumono' | 'nimono' | 'itamemono' | 'tsukemono_sunomono';

export interface Ingrediente {
  nome: string;
  quantidade_base: number;
  unidade: string;
  nota?: string;
}

export interface Passo {
  ordem: number;
  instrucao: string;
  timer_segundos?: number;
  alerta_kenzo?: string;
  dica_tomesan?: string;
}

export interface Receita {
  id: string;
  titulo_pt: string;
  titulo_jp: string;
  categoria: Categoria;
  subtitulo: string;
  tempo_minutos: number;
  rendimento_base_porcoes: number;
  ingredientes: Ingrediente[];
  passos: Passo[];
}

export interface ProdutoMercado {
  ingrediente: string;
  termo: string;
  motivo: string;
}

export type RegiaoEmporio = 'liberdade' | 'online' | 'bairros';

export interface Emporio {
  id: string;
  nome: string;
  regiao: RegiaoEmporio;
  descricao: string;
  tags: string[];
  mapsQuery?: string;
}

/* ---- Contrato de estado persistido (LocalStorage) ---- */

export type UnitMode = 'metric' | 'household';
export type Theme = 'dark' | 'washi';

export interface Prefs {
  unitMode: UnitMode;
  theme: Theme;
}

export interface CookNote {
  id: string;
  /** ISO 8601 */
  criadoEm: string;
  texto: string;
}

export type NotesByRecipe = Record<string, CookNote[]>;
/** receitaId -> nomes dos ingredientes já separados */
export type ChecksByRecipe = Record<string, string[]>;

export type Route =
  | { name: 'home' }
  | { name: 'receitas' }
  | { name: 'mercado' }
  | { name: 'fundamentos' }
  | { name: 'receita'; id: string; kitchen: boolean }
  | { name: 'not-found' };
