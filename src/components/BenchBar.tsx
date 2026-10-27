import { useState } from 'react';
import { useWakeLock } from '../hooks/useWakeLock';
import { FlameIcon, MinusIcon, PlusIcon } from './Icons';
import { MAX_PORCOES, MIN_PORCOES } from './PortionStepper';

/**
 * Barra flutuante do Modo Bancada:
 *  - seletor de porções  [ − ] X porções [ + ]  (recalcula toda a receita na hora)
 *  - botão da chama: mantém a tela do aparelho ligada (Screen Wake Lock) enquanto as mãos estão ocupadas
 */
export function BenchBar({ servings, onChange }: { servings: number; onChange: (n: number) => void }) {
  const [awake, setAwake] = useState(false);
  const wake = useWakeLock(awake);
  const unsupported = typeof navigator !== 'undefined' && !('wakeLock' in navigator);
  const active = awake && wake.status === 'active';
  const problem = awake && (wake.status === 'denied' || wake.status === 'unsupported');

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {problem && (
        <p role="alert" className="pointer-events-auto max-w-sm rounded-2xl bg-surface px-4 py-2 text-center text-sm text-ink ring-1 ring-line">
          Não foi possível manter a tela ligada. Ajuste o tempo de bloqueio do aparelho.
        </p>
      )}
      <div className="flex items-center gap-3">
        <div
          role="group"
          aria-label="Porções"
          className="pointer-events-auto flex items-center rounded-full bg-surface/95 p-1 ring-1 ring-line backdrop-blur"
        >
          <button
            type="button"
            className="btn btn-ghost !min-h-[48px] !min-w-[48px] !px-0"
            onClick={() => onChange(Math.max(MIN_PORCOES, servings - 1))}
            disabled={servings <= MIN_PORCOES}
            aria-label="Diminuir porções"
          >
            <MinusIcon />
          </button>
          <output className="tabular min-w-[6.5rem] text-center text-base font-bold" aria-live="polite">
            {servings} {servings === 1 ? 'porção' : 'porções'}
          </output>
          <button
            type="button"
            className="btn btn-ghost !min-h-[48px] !min-w-[48px] !px-0"
            onClick={() => onChange(Math.min(MAX_PORCOES, servings + 1))}
            disabled={servings >= MAX_PORCOES}
            aria-label="Aumentar porções"
          >
            <PlusIcon />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAwake((v) => !v)}
          aria-pressed={awake}
          aria-disabled={unsupported}
          disabled={unsupported}
          aria-label={unsupported ? 'Manter a tela ligada (indisponível neste navegador)' : 'Manter a tela ligada enquanto cozinho'}
          title={unsupported ? 'Este navegador não permite manter a tela ligada' : active ? 'Tela mantida ligada' : 'Manter a tela ligada'}
          className={`pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full ring-1 backdrop-blur transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
            active ? 'bg-lantern text-onlantern ring-transparent' : 'bg-surface/95 text-ink ring-line hover:ring-mute'
          }`}
        >
          <FlameIcon width={24} height={24} />
        </button>
      </div>
      <p className="sr-only" role="status">
        {active ? 'Tela mantida ligada.' : ''}
      </p>
    </div>
  );
}
