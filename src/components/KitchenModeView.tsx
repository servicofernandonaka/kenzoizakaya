import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { useWakeLock } from '../hooks/useWakeLock';
import { hrefReceita } from '../lib/route';
import type { Receita, UnitMode } from '../types';
import { ChevronLeft, ChevronRight, CloseIcon, FlameIcon, ListIcon } from './Icons';
import { IngredientList } from './IngredientList';
import { PortionStepper } from './PortionStepper';
import { InteractiveTimer } from './InteractiveTimer';
import { TimerDock } from './TimerDock';
import { UnitModeToggle } from './UnitModeToggle';

interface Props {
  receita: Receita;
  factor: number;
  servings: number;
  unitMode: UnitMode;
  onUnitModeChange: (m: UnitMode) => void;
  onServingsChange: (n: number) => void;
  onExit: () => void;
}

/**
 * Modo Cozinha — imersão em tela cheia, alto contraste (sempre tema escuro), fontes enormes
 * e alvos de toque ≥ 72px para usar com a mão suja, a 1 metro de distância.
 */
export function KitchenModeView({ receita, factor, servings, unitMode, onUnitModeChange, onServingsChange, onExit }: Props) {
  const total = receita.passos.length;
  const [index, setIndex] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const finished = index >= total;

  const wake = useWakeLock(true);

  // Tela cheia (best-effort — iOS Safari não suporta e tudo continua funcionando).
  useEffect(() => {
    const el = document.documentElement;
    try {
      if (!document.fullscreenElement && el.requestFullscreen) void el.requestFullscreen().catch(() => undefined);
    } catch {
      /* ignora */
    }
    return () => {
      try {
        if (document.fullscreenElement && document.exitFullscreen) void document.exitFullscreen().catch(() => undefined);
      } catch {
        /* ignora */
      }
    };
  }, []);

  // Trava rolagem do fundo e leva o foco para o diálogo.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    rootRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const next = useCallback(() => setIndex((i) => Math.min(total, i + 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        if (drawer) setDrawer(false);
        else onExit();
      } else if (e.key.toLowerCase() === 'i') {
        setDrawer((d) => !d);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onExit, drawer]);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || drawer) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const passo = finished ? null : receita.passos[index];
  const shortTitle = receita.titulo_pt.split(' (')[0];

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Modo Cozinha: ${receita.titulo_pt}`}
      tabIndex={-1}
      data-theme="dark"
      className="fixed inset-0 z-50 flex h-dvh flex-col bg-canvas text-ink outline-none"
    >
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button type="button" className="btn min-h-[64px] min-w-[64px] text-lg" onClick={onExit} aria-label="Sair do Modo Cozinha">
          <CloseIcon width={28} height={28} />
          <span className="hidden sm:inline">Sair</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-xl font-bold sm:text-2xl">{shortTitle}</p>
          <p className="text-base text-mute" aria-live="polite">
            {finished ? 'Prato pronto' : `Passo ${index + 1} de ${total}`} · {servings} {servings === 1 ? 'porção' : 'porções'}
          </p>
        </div>
        <button
          type="button"
          className="btn min-h-[64px] text-lg"
          onClick={() => setDrawer(true)}
          aria-haspopup="dialog"
          aria-expanded={drawer}
        >
          <ListIcon width={28} height={28} />
          <span>Ingredientes</span>
        </button>
      </header>

      {/* Aviso de Wake Lock (fallback visual) */}
      {(wake.status === 'unsupported' || wake.status === 'denied') && (
        <div role="alert" className="flex flex-wrap items-center gap-3 border-b border-lantern/60 bg-lantern/15 px-4 py-3 text-lg">
          <span className="flex-1">
            ⚠ A tela pode apagar sozinha. {wake.detail} Ajuste o tempo de bloqueio do aparelho ou toque a tela de vez em quando.
          </span>
          {wake.status === 'denied' && (
            <button type="button" className="btn min-h-[56px]" onClick={() => void wake.retry()}>
              Tentar de novo
            </button>
          )}
        </div>
      )}
      {wake.status === 'active' && (
        <p className="sr-only" role="status">
          Tela mantida ligada.
        </p>
      )}

      <TimerDock large />

      {/* Progresso */}
      <div
        className="h-2 w-full bg-line"
        role="progressbar"
        aria-label="Progresso da receita"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(index, total)}
      >
        <div
          className="h-full bg-lantern shadow-lantern transition-[width] duration-300 ease-out"
          style={{ width: `${(Math.min(index, total) / total) * 100}%` }}
        />
      </div>

      {/* Passo atual */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div key={index} className="mx-auto max-w-4xl animate-rise space-y-6">
          {passo ? (
            <>
              <div className="flex items-center gap-4">
                <span
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lantern font-serif text-5xl font-bold text-onlantern shadow-lantern-lg"
                  aria-hidden="true"
                >
                  {passo.ordem}
                </span>
                <h2 className="font-serif text-2xl font-bold text-mute sm:text-3xl">Passo {passo.ordem}</h2>
              </div>

              <p className="text-[clamp(1.5rem,1.2rem+1.6vw,2.75rem)] font-medium leading-snug">{passo.instrucao}</p>

              {passo.timer_segundos !== undefined && (
                <InteractiveTimer
                  size="xl"
                  timerId={`${receita.id}:${passo.ordem}`}
                  label={`${shortTitle} · passo ${passo.ordem}`}
                  seconds={passo.timer_segundos}
                />
              )}

              {passo.alerta_kenzo && (
                <aside className="rounded-2xl border-2 border-lantern bg-lantern/15 p-5 text-[clamp(1.25rem,1.1rem+0.9vw,1.75rem)] leading-snug">
                  <p className="mb-1 flex items-center gap-2 text-base font-bold uppercase tracking-widest text-lanternink">
                    <FlameIcon width={22} height={22} /> Alerta do Kenzō
                  </p>
                  {passo.alerta_kenzo}
                </aside>
              )}
              {passo.dica_tomesan && (
                <aside className="rounded-2xl border-2 border-line bg-raised p-5 text-[clamp(1.25rem,1.1rem+0.9vw,1.75rem)] leading-snug">
                  <p className="mb-1 text-base font-bold uppercase tracking-widest text-mute">Dica de Tomesan</p>
                  {passo.dica_tomesan}
                </aside>
              )}
            </>
          ) : (
            <div className="py-10 text-center">
              <p className="font-serif text-7xl text-lanternink" lang="ja" aria-hidden="true">
                召し上がれ
              </p>
              <h2 className="mt-6 text-4xl font-bold">Prato pronto!</h2>
              <p className="mx-auto mt-3 max-w-xl text-2xl text-mute">
                Itadakimasu. Registre como ficou hoje para a próxima vez ser ainda melhor.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href={`${hrefReceita(receita.id)}`} className="btn btn-lantern min-h-[80px] px-8 text-2xl" onClick={onExit}>
                  Anotar como ficou
                </a>
                <button type="button" className="btn min-h-[80px] px-8 text-2xl" onClick={prev}>
                  Rever último passo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navegação gigante */}
      {!finished && (
        <nav
          aria-label="Navegação entre passos"
          className="grid grid-cols-[1fr_2fr] gap-3 border-t border-line bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <button type="button" className="btn min-h-[88px] text-xl sm:text-2xl" onClick={prev} disabled={index === 0}>
            <ChevronLeft width={32} height={32} /> Voltar
          </button>
          <button type="button" className="btn btn-lantern min-h-[88px] text-xl sm:text-3xl" onClick={next}>
            {index === total - 1 ? 'Concluir' : 'Próximo passo'} <ChevronRight width={36} height={36} />
          </button>
        </nav>
      )}

      {/* Gaveta de ingredientes */}
      {drawer && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/70" onClick={() => setDrawer(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Ingredientes"
            className="animate-rise flex max-h-[88%] flex-col rounded-t-3xl border-t-2 border-lantern bg-surface shadow-lantern"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
              <h2 className="text-2xl font-bold">Ingredientes · {servings} {servings === 1 ? 'porção' : 'porções'}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <PortionStepper large value={servings} onChange={onServingsChange} />
                <UnitModeToggle large value={unitMode} onChange={onUnitModeChange} />
                <button
                  type="button"
                  className="btn min-h-[64px] min-w-[64px]"
                  onClick={() => setDrawer(false)}
                  aria-label="Fechar ingredientes"
                  autoFocus
                >
                  <CloseIcon width={28} height={28} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto overscroll-contain px-4 pb-6">
              <IngredientList receita={receita} factor={factor} mode={unitMode} variant="kitchen" />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
