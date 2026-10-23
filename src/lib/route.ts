import { useSyncExternalStore } from 'react';
import type { Route } from '../types';

/* Roteador por hash (#/...) — funciona em qualquer hospedagem estática, sem configuração de servidor. */

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (path === '') return { name: 'home' };
  if (path === 'receitas') return { name: 'receitas' };
  if (path === 'mercado') return { name: 'mercado' };
  const m = /^receita\/([^/]+)(\/cozinha)?$/.exec(path);
  if (m) return { name: 'receita', id: decodeURIComponent(m[1]), kitchen: Boolean(m[2]) };
  return { name: 'not-found' };
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export const useHash = (): string =>
  useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  );

export const hrefReceita = (id: string, kitchen = false) => `#/receita/${encodeURIComponent(id)}${kitchen ? '/cozinha' : ''}`;

export const navigate = (hash: string) => {
  window.location.hash = hash;
};
