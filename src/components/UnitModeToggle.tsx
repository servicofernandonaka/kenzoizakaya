import type { UnitMode } from '../types';

const OPTIONS: Array<{ value: UnitMode; label: string; hint: string }> = [
  { value: 'metric', label: 'Balança', hint: 'g / ml' },
  { value: 'household', label: 'Medidas caseiras', hint: 'xícara, colher' },
];

/** Alternância reativa de unidade (radiogroup acessível). `large` = alvos de toque gigantes. */
export function UnitModeToggle({
  value,
  onChange,
  large = false,
}: {
  value: UnitMode;
  onChange: (m: UnitMode) => void;
  large?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Sistema de medidas" className="inline-flex rounded-xl border border-line bg-canvas p-1">
      {OPTIONS.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex flex-col items-center justify-center rounded-lg px-4 leading-tight transition-[background-color,box-shadow,color] duration-200 ${
              large ? 'min-h-[64px] text-lg' : 'min-h-[48px] text-sm'
            } ${active ? 'bg-lantern font-bold text-onlantern shadow-lantern' : 'text-mute hover:text-ink'}`}
          >
            <span>{o.label}</span>
            <span className={`text-xs ${active ? 'opacity-90' : 'opacity-80'}`}>{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
