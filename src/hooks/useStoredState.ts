import { useCallback, useSyncExternalStore } from 'react';
import { LocalStorageManager } from '../lib/storage';

/**
 * Estado persistido. `fallback` deve ser uma referência estável (constante de módulo)
 * para que o snapshot do useSyncExternalStore não mude a cada render.
 */
export function useStoredState<T>(
  key: string,
  fallback: T,
  validate: (v: unknown) => v is T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    (cb) => LocalStorageManager.subscribe(key, cb),
    () => LocalStorageManager.read(key, fallback, validate),
    () => fallback,
  );

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = LocalStorageManager.read(key, fallback, validate);
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      LocalStorageManager.write(key, resolved);
    },
    [key, fallback, validate],
  );

  return [value, set];
}
