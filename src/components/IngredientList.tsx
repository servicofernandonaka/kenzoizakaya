import { GlossaryText } from './GlossaryText';
import { useChecks } from '../hooks/useAppState';
import { displayAmount } from '../lib/units';
import type { Receita, UnitMode } from '../types';

interface Props {
  receita: Receita;
  /** multiplicador de porções (porções desejadas / porções base) */
  factor: number;
  mode: UnitMode;
  variant?: 'default' | 'kitchen';
}

/** Lista de ingredientes com marcação persistida ("já separei") e quantidades reativas ao modo de unidade. */
export function IngredientList({ receita, factor, mode, variant = 'default' }: Props) {
  const { checked, toggle, clear } = useChecks(receita.id);
  const kitchen = variant === 'kitchen';

  return (
    <div>
      <ul className="divide-y divide-line">
        {receita.ingredientes.map((ing) => {
          const done = checked.includes(ing.nome);
          const amount = displayAmount(ing, factor, mode);
          const id = `ing-${receita.id}-${variant}-${ing.nome}`;
          return (
            <li key={ing.nome}>
              <label
                htmlFor={id}
                className={`flex cursor-pointer items-start gap-4 py-3 ${kitchen ? 'min-h-[72px] py-4' : 'min-h-[56px]'}`}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(ing.nome)}
                  className={`mt-1 shrink-0 cursor-pointer accent-[#D32F2F] ${kitchen ? 'h-8 w-8' : 'h-6 w-6'}`}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-medium transition-opacity duration-200 ${kitchen ? 'text-xl' : 'text-base'} ${
                      done ? 'text-mute line-through opacity-70' : ''
                    }`}
                  >
                    {ing.nome}
                  </span>
                  {ing.nota && <span className={`block text-mute ${kitchen ? 'mt-1 text-base' : 'text-sm'}`}><GlossaryText text={ing.nota} /></span>}
                </span>
                {/* largura mínima fixa + 2 linhas reservadas: trocar de unidade não desloca o layout */}
                <span className={`tabular shrink-0 text-right ${kitchen ? 'min-w-[9.5rem]' : 'min-w-[7.5rem]'}`}>
                  <span className={`block font-bold ${kitchen ? 'text-2xl' : 'text-lg'}`}>{amount.primary}</span>
                  <span className={`block min-h-[1.25rem] text-mute ${kitchen ? 'text-base' : 'text-sm'}`}>
                    {amount.secondary ?? ' '}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {!kitchen && (
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-mute">
          <span aria-live="polite">
            {checked.length} de {receita.ingredientes.length} separados
          </span>
          <button type="button" className="btn btn-ghost" onClick={clear} disabled={checked.length === 0}>
            Limpar marcações
          </button>
        </div>
      )}
    </div>
  );
}
