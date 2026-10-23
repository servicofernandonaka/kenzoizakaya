import { useState } from 'react';
import { ClockIcon, FlameIcon, HeartIcon, UsersIcon } from '../components/Icons';
import { IngredientList } from '../components/IngredientList';
import { InteractiveTimer } from '../components/InteractiveTimer';
import { NotesLog } from '../components/NotesLog';
import { PortionStepper } from '../components/PortionStepper';
import { UnitConverter } from '../components/UnitConverter';
import { UnitModeToggle } from '../components/UnitModeToggle';
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

export function RecipeDetail({ receita, servings, onServingsChange, unitMode, onUnitModeChange, favorite, onToggleFavorite }: Props) {
  const [converterOpen, setConverterOpen] = useState(false);
  const factor = servings / receita.rendimento_base_porcoes;
  const shortTitle = receita.titulo_pt.split(' (')[0];
  const canConvert = receita.ingredientes.some((i) => hasConversion(i.nome));

  return (
    <article className="space-y-8">
      <a href="#/receitas" className="btn btn-ghost -ml-3 text-mute">
        ← Todas as receitas
      </a>

      <header className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-lantern/20 blur-3xl" aria-hidden="true" />
        <p className="kicker">
          <span aria-hidden="true">{CATEGORIA_ICONE(receita.categoria)}</span> {CATEGORIA_LABEL(receita.categoria)}
        </p>
        <p className="mt-3 font-serif text-5xl leading-tight text-lanternink sm:text-6xl" lang="ja">
          {receita.titulo_jp}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{receita.titulo_pt}</h1>
        <p className="mt-3 max-w-2xl text-lg text-mute">{receita.subtitulo}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          <li className="chip">
            <ClockIcon width={16} height={16} /> {receita.tempo_minutos} min
          </li>
          <li className="chip">
            <UsersIcon width={16} height={16} /> rende {receita.rendimento_base_porcoes} porções
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={hrefReceita(receita.id, true)} className="btn btn-lantern min-h-[56px] px-7 text-lg">
            <FlameIcon width={22} height={22} /> Iniciar Modo Cozinha
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
      </header>

      {/* Ingredientes + controles */}
      <section aria-labelledby="ingredientes" className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="ingredientes" className="text-2xl font-bold">
            Ingredientes
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <PortionStepper value={servings} onChange={onServingsChange} />
            <div>
              <p className="mb-1 text-sm font-semibold text-mute">Medidas</p>
              <UnitModeToggle value={unitMode} onChange={onUnitModeChange} />
            </div>
          </div>
        </div>
        {servings !== receita.rendimento_base_porcoes && (
          <p className="mt-3 text-sm text-mute">
            Escalonado de {receita.rendimento_base_porcoes} para {servings} porções (×{new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(factor)}). Tempos de cozimento não mudam, e as quantidades citadas dentro dos passos continuam as da receita original.{' '}
            <button type="button" className="font-semibold text-lanternink underline underline-offset-4" onClick={() => onServingsChange(receita.rendimento_base_porcoes)}>
              Voltar ao original
            </button>
          </p>
        )}
        <div className="mt-4">
          <IngredientList receita={receita} factor={factor} mode={unitMode} />
        </div>

        {canConvert && (
          <details
            className="mt-5 rounded-xl border border-line bg-canvas/50 p-4"
            open={converterOpen}
            onToggle={(e) => setConverterOpen((e.currentTarget as HTMLDetailsElement).open)}
          >
            <summary className="min-h-[48px] cursor-pointer select-none py-2 text-lg font-semibold">
              Conversor rápido: balança ⇄ medidas caseiras
            </summary>
            <div className="pt-3">
              <UnitConverter ingredientes={receita.ingredientes} />
            </div>
          </details>
        )}
      </section>

      {/* Passos */}
      <section aria-labelledby="preparo">
        <h2 id="preparo" className="text-2xl font-bold">
          Modo de preparo
        </h2>
        <ol className="mt-4 space-y-4">
          {receita.passos.map((p) => (
            <li key={p.ordem} className="panel flex gap-4 p-5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lantern font-serif text-2xl font-bold text-onlantern shadow-lantern"
                aria-hidden="true"
              >
                {p.ordem}
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="sr-only">Passo {p.ordem}</p>
                <p className="text-lg leading-relaxed">{p.instrucao}</p>
                {p.timer_segundos !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm text-mute">Tempo sugerido: {formatDuration(p.timer_segundos)}</p>
                    <InteractiveTimer timerId={`${receita.id}:${p.ordem}`} label={`${shortTitle} · passo ${p.ordem}`} seconds={p.timer_segundos} />
                  </div>
                )}
                {p.alerta_kenzo && (
                  <p className="rounded-xl border border-lantern/60 bg-lantern/10 p-3">
                    <strong className="mr-1 text-lanternink">Alerta do Kenzō:</strong>
                    {p.alerta_kenzo}
                  </p>
                )}
                {p.dica_tomesan && (
                  <p className="rounded-xl border border-line bg-raised p-3">
                    <strong className="mr-1">Dica da Tomesan:</strong>
                    {p.dica_tomesan}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="notas" className="panel p-5 sm:p-6">
        <h2 id="notas" className="mb-4 text-2xl font-bold">
          Caderno do cozinheiro
        </h2>
        <NotesLog recipeId={receita.id} />
      </section>
    </article>
  );
}
