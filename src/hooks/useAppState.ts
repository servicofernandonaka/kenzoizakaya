import { useCallback, useMemo } from 'react';
import { isChecks, isNotes, isPrefs, isShopping, isStepChecks, isStringArray } from '../lib/schema';
import type { ChecksByRecipe, ShoppingState, StepChecksByRecipe, CookNote, NotesByRecipe, Prefs } from '../types';
import { useStoredState } from './useStoredState';

/* Contrato de estado persistido — chaves: prefs, favorites, notes, checks */

/** Sem preferência salva, o tema segue o sistema (linho no claro, carvão no escuro). */
const prefersLight = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: light)').matches;
const prefersReducedMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const DEFAULT_PREFS: Prefs = { unitMode: 'metric', theme: prefersLight ? 'washi' : 'dark' };
const NO_STEPS: StepChecksByRecipe = {};
const EMPTY_SHOPPING: ShoppingState = { itens: [], marcados: [] };
const NO_FAVORITES: string[] = [];
const NO_NOTES: NotesByRecipe = {};
const NO_CHECKS: ChecksByRecipe = {};

export function usePrefs() {
  const [stored, setPrefs] = useStoredState<Prefs>('prefs', DEFAULT_PREFS, isPrefs);
  // fx/som resolvidos: quem prefere menos movimento começa com os efeitos desligados
  const prefs = useMemo(() => ({ ...stored, fx: stored.fx ?? !prefersReducedMotion, som: stored.som ?? false }), [stored]);
  const patch = useCallback((p: Partial<Prefs>) => setPrefs((prev) => ({ ...prev, ...p })), [setPrefs]);
  return [prefs, patch] as const;
}

export function useFavorites() {
  const [favorites, setFavorites] = useStoredState<string[]>('favorites', NO_FAVORITES, isStringArray);
  const toggle = useCallback(
    (id: string) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavorites],
  );
  return { favorites, toggle, isFavorite: (id: string) => favorites.includes(id) };
}

export function useNotes(recipeId: string) {
  const [all, setAll] = useStoredState<NotesByRecipe>('notes', NO_NOTES, isNotes);
  const notes = all[recipeId] ?? [];

  const add = useCallback(
    (texto: string) => {
      const clean = texto.trim();
      if (!clean) return;
      const note: CookNote = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        criadoEm: new Date().toISOString(),
        texto: clean,
      };
      setAll((prev) => ({ ...prev, [recipeId]: [note, ...(prev[recipeId] ?? [])] }));
    },
    [recipeId, setAll],
  );

  const remove = useCallback(
    (id: string) => setAll((prev) => ({ ...prev, [recipeId]: (prev[recipeId] ?? []).filter((n) => n.id !== id) })),
    [recipeId, setAll],
  );

  return { notes, add, remove };
}

export function useChecks(recipeId: string) {
  const [all, setAll] = useStoredState<ChecksByRecipe>('checks', NO_CHECKS, isChecks);
  const checked = all[recipeId] ?? [];

  const toggle = useCallback(
    (nome: string) =>
      setAll((prev) => {
        const cur = prev[recipeId] ?? [];
        return { ...prev, [recipeId]: cur.includes(nome) ? cur.filter((n) => n !== nome) : [...cur, nome] };
      }),
    [recipeId, setAll],
  );

  const clear = useCallback(() => setAll((prev) => ({ ...prev, [recipeId]: [] })), [recipeId, setAll]);

  return { checked, toggle, clear };
}

/** Passos já feitos de uma receita (checklist do preparo). */
export function useStepChecks(recipeId: string) {
  const [all, setAll] = useStoredState<StepChecksByRecipe>('steps', NO_STEPS, isStepChecks);
  const done = all[recipeId] ?? [];

  const toggle = useCallback(
    (ordem: number) =>
      setAll((prev) => {
        const cur = prev[recipeId] ?? [];
        return { ...prev, [recipeId]: cur.includes(ordem) ? cur.filter((n) => n !== ordem) : [...cur, ordem] };
      }),
    [recipeId, setAll],
  );
  const clear = useCallback(() => setAll((prev) => ({ ...prev, [recipeId]: [] })), [recipeId, setAll]);

  return { done, toggle, clear };
}

/** Lista de compras: receitas escolhidas (com porções) e ingredientes já marcados como comprados. */
export function useShopping() {
  const [state, setState] = useStoredState<ShoppingState>('shopping', EMPTY_SHOPPING, isShopping);

  const add = useCallback(
    (id: string, porcoes: number) =>
      setState((s) => (s.itens.some((i) => i.id === id) ? s : { ...s, itens: [...s.itens, { id, porcoes }] })),
    [setState],
  );
  const remove = useCallback(
    (id: string) => setState((s) => ({ ...s, itens: s.itens.filter((i) => i.id !== id) })),
    [setState],
  );
  const setPorcoes = useCallback(
    (id: string, porcoes: number) => setState((s) => ({ ...s, itens: s.itens.map((i) => (i.id === id ? { ...i, porcoes } : i)) })),
    [setState],
  );
  const toggleMarcado = useCallback(
    (key: string) =>
      setState((s) => ({ ...s, marcados: s.marcados.includes(key) ? s.marcados.filter((k) => k !== key) : [...s.marcados, key] })),
    [setState],
  );
  const limparMarcados = useCallback(() => setState((s) => ({ ...s, marcados: [] })), [setState]);
  const esvaziar = useCallback(() => setState(EMPTY_SHOPPING), [setState]);

  return {
    itens: state.itens,
    marcados: state.marcados,
    has: (id: string) => state.itens.some((i) => i.id === id),
    add,
    remove,
    setPorcoes,
    toggleMarcado,
    limparMarcados,
    esvaziar,
  };
}
