import { useTimers } from '../context/TimersContext';
import { formatClock } from '../lib/format';
import { TimerRing } from './InteractiveTimer';
import { CloseIcon, PauseIcon, PlayIcon } from './Icons';

/**
 * Barra de timers ativos — aparece no topo de qualquer tela enquanto houver timers.
 * `large` aumenta alvos de toque e tipografia (Modo Cozinha).
 */
export function TimerDock({ large = false }: { large?: boolean }) {
  const timers = useTimers();
  if (timers.timers.length === 0) return null;

  const ringing = timers.timers.some((t) => t.status === 'done');

  return (
    <section
      aria-label="Timers ativos"
      className={`border-b bg-surface/95 backdrop-blur ${ringing ? 'border-lantern' : 'border-line'}`}
    >
      <ul className="no-scrollbar mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-2">
        {timers.timers.map((t) => {
          const remaining = timers.remainingMs(t);
          const done = t.status === 'done';
          const running = t.status === 'running';
          return (
            <li
              key={t.id}
              className={`flex shrink-0 items-center gap-3 rounded-2xl border bg-canvas/70 py-1.5 pl-2 pr-1.5 ${
                done ? 'animate-ring border-lantern' : 'border-line'
              }`}
            >
              <TimerRing progress={remaining / t.totalMs} done={done} className={large ? 'h-16 w-16' : 'h-12 w-12'} />
              <div className="min-w-0">
                <p className={`max-w-[10rem] truncate text-mute ${large ? 'text-sm' : 'text-xs'}`}>{t.label}</p>
                <p
                  className={`tabular font-bold leading-tight ${large ? 'text-2xl' : 'text-lg'} ${done ? 'text-lanternink' : ''}`}
                  role={done ? 'alert' : undefined}
                >
                  {done ? 'Pronto!' : formatClock(remaining / 1000)}
                </p>
              </div>
              {!done && (
                <button
                  type="button"
                  className="btn btn-ghost !px-3"
                  onClick={() => (running ? timers.pause(t.id) : timers.resume(t.id))}
                  aria-label={`${running ? 'Pausar' : 'Retomar'} timer ${t.label}`}
                >
                  {running ? <PauseIcon /> : <PlayIcon />}
                </button>
              )}
              <button
                type="button"
                className={`btn !px-3 ${done ? 'btn-lantern' : 'btn-ghost'}`}
                onClick={() => timers.remove(t.id)}
                aria-label={`${done ? 'Silenciar e remover' : 'Remover'} timer ${t.label}`}
              >
                <CloseIcon />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
