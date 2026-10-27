import { useTimers } from '../context/TimersContext';
import { formatClock } from '../lib/format';
import { ClockIcon, PauseIcon, PlayIcon, ResetIcon, CloseIcon } from './Icons';

const R = 46;
const CIRC = 2 * Math.PI * R;

/** Anel de progresso — esvazia conforme o tempo passa. */
export function TimerRing({
  progress,
  done,
  className = '',
  children,
}: {
  progress: number;
  done?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div className={`relative shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(var(--c-line))" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={done ? 'rgb(var(--c-accent))' : 'rgb(var(--c-lanternink))'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - p)}
          style={{ transition: 'stroke-dashoffset 260ms linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

interface Props {
  timerId: string;
  label: string;
  seconds: number;
  size?: 'md' | 'xl';
}

/** Timer de um passo da receita: botão de iniciar -> anel + controles (pausar, reiniciar, parar). */
export function InteractiveTimer({ timerId, label, seconds, size = 'md' }: Props) {
  const timers = useTimers();
  const timer = timers.get(timerId);
  const xl = size === 'xl';
  const btnSize = xl ? 'min-h-[72px] min-w-[72px] px-6 text-xl' : '';

  if (!timer) {
    return (
      <button
        type="button"
        className={`btn btn-lantern ${xl ? 'min-h-[88px] w-full text-2xl' : ''}`}
        onClick={() => timers.start(timerId, label, seconds)}
      >
        <ClockIcon width={xl ? 32 : 20} height={xl ? 32 : 20} />
        Iniciar timer · <span className="tabular">{formatClock(seconds)}</span>
      </button>
    );
  }

  const remaining = timers.remainingMs(timer);
  const done = timer.status === 'done';
  const running = timer.status === 'running';

  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-canvas/60 p-3 ${
        done ? 'animate-ring border-lantern' : 'border-line'
      } ${xl ? 'justify-center gap-6 p-5' : ''}`}
      role="group"
      aria-label={`Timer: ${label}`}
    >
      <TimerRing progress={remaining / timer.totalMs} done={done} className={xl ? 'h-52 w-52' : 'h-20 w-20'}>
        <span className={`tabular font-bold ${xl ? 'text-5xl' : 'text-lg'}`}>
          {done ? '0:00' : formatClock(remaining / 1000)}
        </span>
      </TimerRing>

      <div className={`flex flex-wrap items-center gap-2 ${xl ? 'justify-center' : ''}`}>
        {done ? (
          <>
            <p role="alert" className={`w-full font-bold text-lanternink ${xl ? 'text-3xl' : 'text-base'}`}>
              Tempo esgotado!
            </p>
            <button type="button" className={`btn btn-lantern ${btnSize}`} onClick={() => timers.remove(timerId)}>
              <CloseIcon /> Silenciar
            </button>
            <button type="button" className={`btn ${btnSize}`} onClick={() => timers.start(timerId, label, seconds)}>
              <ResetIcon /> Repetir
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`btn ${btnSize}`}
              onClick={() => (running ? timers.pause(timerId) : timers.resume(timerId))}
              aria-label={running ? 'Pausar timer' : 'Retomar timer'}
            >
              {running ? <PauseIcon /> : <PlayIcon />}
              {running ? 'Pausar' : 'Retomar'}
            </button>
            <button type="button" className={`btn ${btnSize}`} onClick={() => timers.reset(timerId)} aria-label="Reiniciar timer">
              <ResetIcon />
              <span className={xl ? '' : 'sr-only sm:not-sr-only'}>Reiniciar</span>
            </button>
            <button type="button" className={`btn btn-ghost ${btnSize}`} onClick={() => timers.remove(timerId)} aria-label="Remover timer">
              <CloseIcon />
              <span className={xl ? '' : 'sr-only'}>Remover</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
