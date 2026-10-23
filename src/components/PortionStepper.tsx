import { useId } from 'react';
import { MinusIcon, PlusIcon } from './Icons';

export const MIN_PORCOES = 1;
export const MAX_PORCOES = 12;

/** Calculadora de porções: − / + com limites de 1 a 12. `large` = alvos de toque gigantes (Modo Cozinha). */
export function PortionStepper({
  value,
  onChange,
  large = false,
}: {
  value: number;
  onChange: (n: number) => void;
  large?: boolean;
}) {
  const uid = useId();
  const size = large ? 'min-h-[64px] min-w-[64px]' : '';
  return (
    <div>
      <p id={`${uid}-label`} className="mb-1 text-sm font-semibold text-mute">
        Porções
      </p>
      <div role="group" aria-labelledby={`${uid}-label`} className="inline-flex items-center rounded-xl border border-line bg-canvas">
        <button
          type="button"
          className={`btn btn-ghost ${size}`}
          onClick={() => onChange(Math.max(MIN_PORCOES, value - 1))}
          disabled={value <= MIN_PORCOES}
          aria-label="Diminuir porções"
        >
          <MinusIcon width={large ? 28 : 20} height={large ? 28 : 20} />
        </button>
        <output className={`tabular text-center font-bold ${large ? 'min-w-[3.5rem] text-3xl' : 'min-w-[3rem] text-xl'}`} aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className={`btn btn-ghost ${size}`}
          onClick={() => onChange(Math.min(MAX_PORCOES, value + 1))}
          disabled={value >= MAX_PORCOES}
          aria-label="Aumentar porções"
        >
          <PlusIcon width={large ? 28 : 20} height={large ? 28 : 20} />
        </button>
      </div>
    </div>
  );
}
