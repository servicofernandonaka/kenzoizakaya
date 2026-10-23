import { getCategoria } from '../data/categorias';
import type { Categoria } from '../types';

export const CATEGORIA_LABEL = (id: Categoria): string => getCategoria(id).nome;
export const CATEGORIA_ICONE = (id: Categoria): string => getCategoria(id).icone;

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** 1800 -> "30 min"; 5400 -> "1 h 30 min" */
export function formatDuration(totalSeconds: number): string {
  const mins = Math.round(totalSeconds / 60);
  if (mins < 1) return `${totalSeconds} s`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('pt-BR');
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

export const stripQuotes = (s: string) => s.replace(/^["']+|["']+$/g, '');
