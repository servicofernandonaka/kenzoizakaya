/**
 * LocalStorageManager — camada de persistência resiliente.
 *
 * - namespace + versão nas chaves ("kenzo:v1:")
 * - JSON.parse protegido e validado por type-guard; dado corrompido => fallback (nunca lança)
 * - se o LocalStorage estiver bloqueado/cheio (modo privado, cota), cai para memória da sessão
 * - snapshots em cache para uso seguro com useSyncExternalStore
 * - sincroniza abas via evento "storage" e componentes via emitter interno
 */

const NS = 'kenzo:v1:';

type Listener = () => void;

const memory = new Map<string, string>();
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function probe(): Storage | null {
  try {
    const s = window.localStorage;
    const k = '__kenzo_probe__';
    s.setItem(k, '1');
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

let backend: Storage | null | undefined;
const store = (): Storage | null => {
  if (backend === undefined) backend = typeof window === 'undefined' ? null : probe();
  return backend;
};

function getRaw(key: string): string | null {
  const full = NS + key;
  try {
    const s = store();
    if (s) {
      const v = s.getItem(full);
      if (v !== null) return v;
    }
  } catch {
    /* cai para memória */
  }
  return memory.get(full) ?? null;
}

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

let storageEventBound = false;
function bindStorageEvent() {
  if (storageEventBound || typeof window === 'undefined') return;
  storageEventBound = true;
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(NS)) emit(e.key.slice(NS.length));
    else if (e.key === null) listeners.forEach((_, k) => emit(k));
  });
}

export const LocalStorageManager = {
  /** true quando os dados realmente sobrevivem a um reload. */
  isPersistent(): boolean {
    return store() !== null;
  },

  read<T>(key: string, fallback: T, validate: (v: unknown) => v is T): T {
    const raw = getRaw(key);
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value as T;

    let value: T = fallback;
    if (raw !== null) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) value = parsed;
        else console.warn(`[storage] "${key}" com formato inválido — usando valor padrão.`);
      } catch {
        console.warn(`[storage] "${key}" corrompido (JSON inválido) — usando valor padrão.`);
      }
    }
    cache.set(key, { raw, value });
    return value;
  },

  write<T>(key: string, value: T): boolean {
    const full = NS + key;
    const raw = JSON.stringify(value);
    let persisted = false;
    try {
      const s = store();
      if (s) {
        s.setItem(full, raw);
        persisted = true;
      }
    } catch {
      /* cota excedida etc. */
    }
    if (!persisted) memory.set(full, raw);
    else memory.delete(full);
    emit(key);
    return persisted;
  },

  remove(key: string) {
    const full = NS + key;
    try {
      store()?.removeItem(full);
    } catch {
      /* ignora */
    }
    memory.delete(full);
    emit(key);
  },

  subscribe(key: string, listener: Listener): () => void {
    bindStorageEvent();
    let set = listeners.get(key);
    if (!set) listeners.set(key, (set = new Set()));
    set.add(listener);
    return () => {
      set!.delete(listener);
    };
  },
};
