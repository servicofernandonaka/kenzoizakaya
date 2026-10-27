import { useState } from 'react';
import { BenchBar } from '../components/BenchBar';
import { GlossaryText } from '../components/GlossaryText';
import { CheckIcon, ClockIcon, HeartIcon, UsersIcon } from '../components/Icons';
import { IngredientList } from '../components/IngredientList';
import { InteractiveTimer } from '../components/InteractiveTimer';
import { NotesLog } from '../components/NotesLog';
import { RecipeCover } from '../components/RecipeCover';
import { UnitConverter } from '../components/UnitConverter';
import { UnitModeToggle } from '../components/UnitModeToggle';
import { useStepChecks } from '../hooks/useAppState';
import { CATEGORIA_LABEL, formatDuration } from '../lib/format';
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
 * Modo Bancada: leitura contida (max-w-3xl), checklist de ingredientes, passos numerados com timers
 * e a barra flutuante de porções + tela sempre ligada.
 */
export function RecipeDetail({ receita, servings, onServingsChange, unitMode, onUnitModeChange, favorite, onToggleFavorite }: Props) {
  const [converterOpen, setConverterOpen] = useState(false);
  const steps = useStepChecks(receita.id);
  const factor = servings / receita.rendimento_base_porcoes;
  const shortTitle = receita.titulo_pt.split(' (')[0];
  const canConvert = receita.ingredientes.some((i) => hasConversion(i.nome));
  const total = receita.passos.length;

  return (
    <article className="mx-auto max-w-3xl space-y-16 pb-36">
      <div>
        <a href="#/receitas" className="btn btn-ghost -ml-4 text-mute">
          ← O Diário de Receitas
        </a>
      </div>

      <header>
        <RecipeCover eager receita={receita} className="aspect-[16/9] w-full rounded-2xl" />
        <p className="kicker mt-8">{CATEGORIA_LABEL(receita.categoria)}</p>
        <h1 className="mt-3 text-4xl leading-[1.12] sm:text-5xl">{receita.titulo_pt}</h1>
        <p className="mt-2 font-serif text-2xl text-lanternink" lang="ja">
          {receita.titulo_jp}
        </p>
        <p className="mt-5 text-lg leading-relaxed text-mute">{receita.subtitulo}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-mute">
          <span className="tabular inline-flex items-center gap-1.5">
            <ClockIcon width={18} height={18} /> {receita.tempo_minutos} min
          </span>
          <span className="tabular inline-flex items-center gap-1.5">
            <UsersIcon width={18} height={18} /> rende {receita.rendimento_base_porcoes} porções
          </span>
          <span className="tabular">{total} passos</span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" className="btn" aria-pressed={favorite} onClick={() => onToggleFavorite(receita.id)}>
            <HeartIcon filled={favorite} className={favorite ? 'text-lanternink' : ''} /> {favorite ? 'Nos favoritos' : 'Favoritar'}
          </button>
          <a href={hrefReceita(receita.id, true)} className="btn">
            Passo a passo em tela cheia
          </a>
        </div>
      </header>

      {/* Ingredientes — checklist */}
      <section aria-labelledby="ingredientes">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="ingredientes" className="text-3xl">
              Ingredientes
            </h2>
            <p className="mt-1 text-sm text-mute">Toque para marcar o que já separou na bancada.</p>
          </div>
          <UnitModeToggle value={unitMode} onChange={onUnitModeChange} />
        </div>

        {servings !== receita.rendimento_base_porcoes && (
          <p className="mt-4 text-sm text-mute">
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

        <div className="mt-6">
          <IngredientList receita={receita} factor={factor} mode={unitMode} />
        </div>

        {canConvert && (
          <details
            className="mt-6 rounded-2xl border border-line bg-surface p-4"
            open={converterOpen}
            onToggle={(e) => setConverterOpen((e.currentTarget as HTMLDetailsElement).open)}
          >
            <summary className="min-h-[48px] cursor-pointer select-none py-2 text-lg font-medium">Conversor: balança ⇄ medidas caseiras</summary>
            <div className="pt-3">
              <UnitConverter ingredientes={receita.ingredientes} />
            </div>
          </details>
        )}
      </section>

      {/* Preparo — passos numerados */}
      <section aria-labelledby="preparo">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="preparo" className="text-3xl">
            Modo de preparo
          </h2>
          <p className="tabular text-sm text-mute" aria-live="polite">
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

        <ol className="mt-10 space-y-12">
          {receita.passos.map((p) => {
            const done = steps.done.includes(p.ordem);
            return (
              <li key={p.ordem} className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-8">
                <button
                  type="button"
                  onClick={() => steps.toggle(p.ordem)}
                  aria-pressed={done}
                  aria-label={`Passo ${p.ordem}: marcar como ${done ? 'não feito' : 'feito'}`}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-xl font-semibold transition-colors duration-300 sm:h-14 sm:w-14 sm:text-2xl ${
                    done ? 'border-transparent bg-lantern text-onlantern' : 'border-mute/60 text-ink hover:border-ink'
                  }`}
                >
                  {done ? <CheckIcon width={22} height={22} /> : p.ordem}
                </button>

                <div className={`space-y-5 pt-1 transition-opacity duration-300 ${done ? 'opacity-40' : ''}`}>
                  <p className="reading">
                    <GlossaryText text={p.instrucao} />
                  </p>

                  {p.timer_segundos !== undefined && (
                    <div className="space-y-1.5">
                      <p className="text-sm text-mute">Tempo sugerido: {formatDuration(p.timer_segundos)}</p>
                      <InteractiveTimer timerId={`${receita.id}:${p.ordem}`} label={`${shortTitle} · passo ${p.ordem}`} seconds={p.timer_segundos} />
                    </div>
                  )}
                  {p.alerta_kenzo && (
                    <p className="max-w-[62ch] border-l-2 border-accent bg-accentsubtle py-3 pl-5 pr-4 leading-relaxed">
                      <strong className="mr-1 text-lanternink">Alerta do Kenzō:</strong>
                      <GlossaryText text={p.alerta_kenzo} />
                    </p>
                  )}
                  {p.dica_tomesan && (
                    <p className="max-w-[62ch] border-l-2 border-line py-1 pl-5 leading-relaxed text-mute">
                      <strong className="mr-1 text-ink">Dica de Tomesan:</strong>
                      <GlossaryText text={p.dica_tomesan} />
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="notas">
        <h2 id="notas" className="mb-5 text-3xl">
          Caderno do cozinheiro
        </h2>
        <NotesLog recipeId={receita.id} />
      </section>

      <BenchBar servings={servings} onChange={onServingsChange} />
    </article>
  );
}
