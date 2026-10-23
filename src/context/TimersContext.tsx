import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { AlarmLoop, resumeAudioIfNeeded, unlockAudio } from '../lib/audio';

/**
 * Multi-timers. O tempo restante é derivado de um instante absoluto (`endsAt`), não de contagem de ticks —
 * assim continua exato mesmo se o navegador estrangular timers em segundo plano.
 */

export type TimerStatus = 'running' | 'paused' | 'done';

export interface TimerItem {
  id: string;
  label: string;
  totalMs: number;
  remainingMs: number;
  endsAt: number | null;
  status: TimerStatus;
}

interface State {
  items: TimerItem[];
  now: number;
}

type Action =
  | { type: 'start'; id: string; label: string; totalMs: number; now: number }
  | { type: 'pause'; id: string; now: number }
  | { type: 'resume'; id: string; now: number }
  | { type: 'reset'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'tick'; now: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start': {
      const fresh: TimerItem = {
        id: action.id,
        label: action.label,
        totalMs: action.totalMs,
        remainingMs: action.totalMs,
        endsAt: action.now + action.totalMs,
        status: 'running',
      };
      const exists = state.items.some((t) => t.id === action.id);
      return {
        now: action.now,
        items: exists ? state.items.map((t) => (t.id === action.id ? fresh : t)) : [...state.items, fresh],
      };
    }
    case 'pause':
      return {
        now: action.now,
        items: state.items.map((t) =>
          t.id === action.id && t.status === 'running'
            ? { ...t, status: 'paused', remainingMs: Math.max(0, (t.endsAt ?? action.now) - action.now), endsAt: null }
            : t,
        ),
      };
    case 'resume':
      return {
        now: action.now,
        items: state.items.map((t) =>
          t.id === action.id && t.status === 'paused'
            ? { ...t, status: 'running', endsAt: action.now + t.remainingMs }
            : t,
        ),
      };
    case 'reset':
      return {
        ...state,
        items: state.items.map((t) =>
          t.id === action.id ? { ...t, status: 'paused', remainingMs: t.totalMs, endsAt: null } : t,
        ),
      };
    case 'remove':
      return { ...state, items: state.items.filter((t) => t.id !== action.id) };
    case 'tick': {
      let changed = false;
      const items = state.items.map((t) => {
        if (t.status === 'running' && t.endsAt !== null && t.endsAt <= action.now) {
          changed = true;
          return { ...t, status: 'done' as const, remainingMs: 0, endsAt: null };
        }
        return t;
      });
      return { now: action.now, items: changed ? items : state.items };
    }
  }
}

interface TimersApi {
  timers: TimerItem[];
  get: (id: string) => TimerItem | undefined;
  remainingMs: (t: TimerItem) => number;
  start: (id: string, label: string, seconds: number) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  reset: (id: string) => void;
  remove: (id: string) => void;
  silenceAll: () => void;
}

const TimersContext = createContext<TimersApi | null>(null);

export function TimersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ items: [], now: Date.now() }));

  const hasRunning = state.items.some((t) => t.status === 'running');
  const hasDone = state.items.some((t) => t.status === 'done');

  useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(() => dispatch({ type: 'tick', now: Date.now() }), 250);
    return () => window.clearInterval(id);
  }, [hasRunning]);

  // Ao voltar para a aba: recalcula na hora e reativa o áudio.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        dispatch({ type: 'tick', now: Date.now() });
        resumeAudioIfNeeded();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    if (hasDone) AlarmLoop.start();
    else AlarmLoop.stop();
    return () => AlarmLoop.stop();
  }, [hasDone]);

  // Mostra o menor tempo restante no título da aba.
  useEffect(() => {
    const base = 'Izakaya do Kenzō';
    const running = state.items.filter((t) => t.status === 'running' && t.endsAt !== null);
    if (hasDone) {
      document.title = `🔔 Pronto! · ${base}`;
    } else if (running.length) {
      const next = Math.min(...running.map((t) => Math.max(0, (t.endsAt as number) - state.now)));
      const s = Math.ceil(next / 1000);
      document.title = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · ${base}`;
    } else {
      document.title = base;
    }
  }, [state.items, state.now, hasDone]);

  const start = useCallback((id: string, label: string, seconds: number) => {
    void unlockAudio(); // precisa ocorrer dentro do gesto do usuário
    dispatch({ type: 'start', id, label, totalMs: seconds * 1000, now: Date.now() });
  }, []);

  const api = useMemo<TimersApi>(
    () => ({
      timers: state.items,
      get: (id) => state.items.find((t) => t.id === id),
      remainingMs: (t) => (t.status === 'running' && t.endsAt !== null ? Math.max(0, t.endsAt - state.now) : t.remainingMs),
      start,
      pause: (id) => dispatch({ type: 'pause', id, now: Date.now() }),
      resume: (id) => {
        void unlockAudio();
        dispatch({ type: 'resume', id, now: Date.now() });
      },
      reset: (id) => dispatch({ type: 'reset', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      silenceAll: () => state.items.filter((t) => t.status === 'done').forEach((t) => dispatch({ type: 'remove', id: t.id })),
    }),
    [state, start],
  );

  return <TimersContext.Provider value={api}>{children}</TimersContext.Provider>;
}

export function useTimers(): TimersApi {
  const ctx = useContext(TimersContext);
  if (!ctx) throw new Error('useTimers precisa estar dentro de <TimersProvider>.');
  return ctx;
}
