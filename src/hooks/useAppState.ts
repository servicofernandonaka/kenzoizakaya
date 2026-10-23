import { useCallback } from 'react';
import { isChecks, isNotes, isPrefs, isStringArray } from '../lib/schema';
import type { ChecksByRecipe, CookNote, NotesByRecipe, Prefs } from '../types';
import { useStoredState } from './useStoredState';

/* Contrato de estado persistido — chaves: prefs, favorites, notes, checks */

const DEFAULT_PREFS: Prefs = { unitMode: 'metric', theme: 'dark' };
const NO_FAVORITES: string[] = [];
const NO_NOTES: NotesByRecipe = {};
const NO_CHECKS: ChecksByRecipe = {};

export function usePrefs() {
  const [prefs, setPrefs] = useStoredState<Prefs>('prefs', DEFAULT_PREFS, isPrefs);
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
