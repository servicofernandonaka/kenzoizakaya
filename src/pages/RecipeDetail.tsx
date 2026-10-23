import { useState } from 'react';
import { CheckIcon, ClockIcon, FlameIcon, HeartIcon, UsersIcon } from '../components/Icons';
import { IngredientList } from '../components/IngredientList';
import { InteractiveTimer } from '../components/InteractiveTimer';
import { NotesLog } from '../components/NotesLog';
import { PortionStepper } from '../components/PortionStepper';
import { RecipeCover } from '../components/RecipeCover';
import { UnitConverter } from '../components/UnitConverter';
import { UnitModeToggle } from '../components/UnitModeToggle';
import { useStepChecks } from '../hooks/useAppState';
import { CATEGORIA_ICONE, CATEGORIA_LABEL, formatDuration } from '../lib/format';
import { hrefReceita } from '../lib/route';
import { hasConversion } from '../lib/units';
import type { Receita, UnitMode } from '../types';

interface Props {
  receita: Receita;
  servings: number;
  onServingsChange: (n: number) => void;
  unitMode: UnitMode;
  onUnitModeChange: (m: UnitMode) => void;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

/**
 * Página de leitura focada: ingredientes em checklist (coluna fixa) ao lado do preparo numerado,
 * com espaçamento generoso. No celular, ingredientes primeiro e depois os passos.
 */
export function RecipeDetail({ receita, servings, onServingsChange, unitMode, onUnitModeChange, favorite, onToggleFavorite }: Props) {
  const [converterOpen, setConverterOpen] = useState(false);
  const steps = useStepChecks(receita.id);
  const factor = servings / receita.rendimento_base_porcoes;
  const shortTitle = receita.titulo_pt.split(' (')[0];
  const canConvert = receita.ingredientes.some((i) => hasConversion(i.nome));
  const total = receita.passos.length;

  return (
    <article className="space-y-10">
      <a href="#/receitas" className="btn btn-ghost -ml-3 text-mute">
        ← O Diário de Receitas
      </a>

      <header className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-panel">
        <RecipeCover receita={receita} className="aspect-[16/9] w-full sm:aspect-[3/1]" />
        <div className="p-6 sm:p-10">
          <p className="kicker flex items-center gap-1.5">
            <span aria-hidden="true">{CATEGORIA_ICONE(receita.categoria)}</span> {CATEGORIA_LABEL(receita.categoria)}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.1] sm:text-5xl">{receita.titulo_pt}</h1>
          <p className="mt-2 font-serif text-2xl text-lanternink" lang="ja">
            {receita.titulo_jp}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{receita.subtitulo}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            <li className="chip">
              <ClockIcon width={16} height={16} /> {receita.tempo_minutos} min
            </li>
            <li className="chip">
              <UsersIcon width={16} height={16} /> rende {receita.rendimento_base_porcoes} porções
            </li>
            <li className="chip">{total} passos</li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={hrefReceita(receita.id, true)} className="btn btn-lantern min-h-[56px] px-7 text-lg">
              <FlameIcon width={22} height={22} /> Modo Cozinha em tela cheia
            </a>
            <button
              type="button"
              className={`btn min-h-[56px] ${favorite ? 'text-lanternink' : ''}`}
              aria-pressed={favorite}
              onClick={() => onToggleFavorite(receita.id)}
            >
              <HeartIcon filled={favorite} /> {favorite ? 'Nos favoritos' : 'Favoritar'}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12">
        {/* Ingredientes — checklist */}
        <aside
          aria-labelledby="ingredientes"
          className="panel p-5 sm:p-6 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto"
        >
          <h2 id="ingredientes" className="text-2xl font-bold">
            Ingredientes
          </h2>
          <p className="mt-1 text-sm text-mute">Toque para marcar o que já separou. Fica salvo neste aparelho.</p>

          <div className="mt-4 flex flex-wrap items-end gap-4">
            <PortionStepper value={servings} onChange={onServingsChange} />
            <div>
              <p className="mb-1 text-sm font-semibold text-mute">Medidas</p>
              <UnitModeToggle value={unitMode} onChange={onUnitModeChange} />
            </div>
          </div>

          {servings !== receita.rendimento_base_porcoes && (
            <p className="mt-3 text-sm text-mute">
              Escalonado de {receita.rendimento_base_porcoes} para {servings} porções (×
              {new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(factor)}). Tempos de cozimento não mudam, e as
              quantidades citadas dentro dos passos continuam as da receita original.{' '}
              <button
                type="button"
                className="font-semibold text-lanternink underline underline-offset-4"
                onClick={() => onServingsChange(receita.rendimento_base_porcoes)}
              >
                Voltar ao original
              </button>
            </p>
          )}

          <div className="mt-4">
            <IngredientList receita={receita} factor={factor} mode={unitMode} />
          </div>

          {canConvert && (
            <details
              className="mt-5 rounded-2xl border border-line bg-canvas/50 p-4"
              open={converterOpen}
              onToggle={(e) => setConverterOpen((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary className="min-h-[48px] cursor-pointer select-none py-2 text-lg font-semibold">
                Conversor: balança ⇄ medidas caseiras
              </summary>
              <div className="pt-3">
                <UnitConverter ingredientes={receita.ingredientes} />
              </div>
            </details>
          )}
        </aside>

        {/* Preparo — passos numerados */}
        <section aria-labelledby="preparo">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="preparo" className="text-3xl font-bold">
              Modo de preparo
            </h2>
            <p className="text-sm text-mute" aria-live="polite">
              {steps.done.length} de {total} passos feitos
              {steps.done.length > 0 && (
                <>
                  {' · '}
                  <button type="button" className="font-semibold text-lanternink underline underline-offset-4" onClick={steps.clear}>
                    Desmarcar
                  </button>
                </>
              )}
            </p>
          </div>

          <ol className="mt-8 space-y-10">
            {receita.passos.map((p) => {
              const done = steps.done.includes(p.ordem);
              return (
                <li key={p.ordem} className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-7">
                  <button
                    type="button"
                    onClick={() => steps.toggle(p.ordem)}
                    aria-pressed={done}
                    aria-label={`Passo ${p.ordem}: marcar como ${done ? 'não feito' : 'feito'}`}
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-serif text-2xl font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-95 sm:h-16 sm:w-16 sm:text-3xl ${
                      done
                        ? 'border-lantern bg-lantern text-onlantern shadow-lantern'
                        : 'border-line bg-surface text-lanternink hover:border-lantern'
                    }`}
                  >
                    {done ? <CheckIcon width={26} height={26} /> : p.ordem}
                  </button>

                  <div className={`space-y-4 pt-1 transition-opacity duration-200 ${done ? 'opacity-55' : ''}`}>
                    <p className="reading">{p.instrucao}</p>

                    {p.timer_segundos !== undefined && (
                      <div className="space-y-1.5">
                        <p className="text-sm text-mute">Tempo sugerido: {formatDuration(p.timer_segundos)}</p>
                        <InteractiveTimer
                          timerId={`${receita.id}:${p.ordem}`}
                          label={`${shortTitle} · passo ${p.ordem}`}
                          seconds={p.timer_segundos}
                        />
                      </div>
                    )}
                    {p.alerta_kenzo && (
                      <p className="max-w-[62ch] rounded-2xl border-l-4 border-lantern bg-lantern/10 p-4 leading-relaxed">
                        <strong className="mr-1 text-lanternink">Alerta do Kenzō:</strong>
                        {p.alerta_kenzo}
                      </p>
                    )}
                    {p.dica_tomesan && (
                      <p className="max-w-[62ch] rounded-2xl border-l-4 border-mute/50 bg-raised/60 p-4 leading-relaxed">
                        <strong className="mr-1">Dica de Tomesan:</strong>
                        {p.dica_tomesan}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section aria-labelledby="notas" className="panel p-6 sm:p-8">
        <h2 id="notas" className="mb-4 text-2xl font-bold">
          Caderno do cozinheiro
        </h2>
        <NotesLog recipeId={receita.id} />
      </section>
    </article>
  );
}
