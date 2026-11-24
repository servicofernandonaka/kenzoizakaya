import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Glossario } from '../components/Glossario';
import { IngredientesComuns } from '../components/IngredientesComuns';
import { RecipeCover } from '../components/RecipeCover';
import { findReceita } from '../data';
import { hrefReceita } from '../lib/route';
import { BASES, INSTRUMENTOS, INTRO, PILARES_AGEMONO, PILARES_NIMONO, TABS, TECNICAS, type FundamentoTabId } from '../data/fundamentos';

/** Fundamentos do Oyaji: abas acessíveis (setas, Home, End) com bases, técnicas e instrumentos. */
export function Fundamentos() {
  const uid = useId();
  const [tab, setTab] = useState<FundamentoTabId>('dashi');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    let to = -1;
    if (e.key === 'ArrowRight') to = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') to = index === 0 ? last : index - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    if (to < 0) return;
    e.preventDefault();
    setTab(TABS[to].id);
    refs.current[TABS[to].id]?.focus();
  };

  return (
    <section aria-labelledby={`${uid}-h`} className="space-y-12">
      <header>
        <p className="kicker">{INTRO.kicker}</p>
        <h1 id={`${uid}-h`} className="mt-3 text-5xl leading-tight sm:text-6xl">
          {INTRO.titulo}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{INTRO.texto}</p>
      </header>

      <div role="tablist" aria-label="Fundamentos" className="flex flex-wrap gap-2">
        {TABS.map((t, i) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              id={`${uid}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="pill"
            >
              <span aria-hidden="true">{t.emoji}</span> {t.label}
            </button>
          );
        })}
      </div>

      {/* As Bases */}
      <div
        role="tabpanel"
        id={`${uid}-panel-dashi`}
        aria-labelledby={`${uid}-tab-dashi`}
        hidden={tab !== 'dashi'}
        className="grid gap-x-10 gap-y-16 md:grid-cols-2"
      >
        {BASES.map((b) => {
          const receita = findReceita(b.receitaId);
          return (
            <article key={b.titulo} className="group relative flex flex-col">
              {receita && (
                <div className="overflow-hidden rounded-2xl">
                  <RecipeCover receita={receita} className="aspect-[16/9] w-full transition-transform duration-500 ease-in-out group-hover:scale-[1.02]" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 pt-5">
                <h2 className="text-2xl leading-snug">
                  <a
                    href={hrefReceita(b.receitaId)}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-focus"
                  >
                    {b.titulo}
                  </a>
                </h2>
                <span className="chip shrink-0 !text-xs">{b.selo}</span>
              </div>
              <p className="mt-2 text-mute">{b.descricao}</p>
              <p className="mt-4 border-l-2 border-accent pl-4">
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-mute">Proporção sagrada</span>
                <strong className="mt-1 block text-sm">{b.proporcao}</strong>
              </p>
              <ol className="mt-5 space-y-2 text-sm leading-relaxed">
                {b.passos.map((p, i) => {
                  const [lead, rest] = p.startsWith('Segredo do Oyaji:') ? ['Segredo do Oyaji:', p.slice(17)] : [null, p];
                  return (
                    <li key={i} className="flex gap-2">
                      <strong aria-hidden="true" className="tabular shrink-0 whitespace-nowrap">{i + 1}.</strong>
                      <span>
                        {lead && <em className="font-semibold text-lanternink">{lead}</em>}
                        {rest}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-5 text-sm font-semibold underline underline-offset-4" aria-hidden="true">
                Ver ficha completa →
              </p>
            </article>
          );
        })}
      </div>

      {/* Preparo (Shitajishi) */}
      <div
        role="tabpanel"
        id={`${uid}-panel-preparo`}
        aria-labelledby={`${uid}-tab-preparo`}
        hidden={tab !== 'preparo'}
        className="grid gap-x-12 gap-y-10 md:grid-cols-2"
      >
        {[...TECNICAS, ...PILARES_AGEMONO, ...PILARES_NIMONO].map((t) => (
          <article key={t.titulo} className="border-t border-line pt-6">
            <h2 className="text-2xl leading-snug">{t.titulo}</h2>
            <p className="mt-2 leading-relaxed text-mute">{t.descricao}</p>
            {t.itens && (
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                {t.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
            {t.citacao && (
              <blockquote className="mt-4 border-l-2 border-accent pl-5 font-serif text-lg italic leading-snug">
                “{t.citacao}”
                <footer className="mt-2 font-sans text-sm not-italic text-mute">— Mestre Kenzo</footer>
              </blockquote>
            )}
          </article>
        ))}
      </div>

      {/* Instrumentos de Ferro */}
      <div
        role="tabpanel"
        id={`${uid}-panel-instrumentos`}
        aria-labelledby={`${uid}-tab-instrumentos`}
        hidden={tab !== 'instrumentos'}
        className="grid gap-x-10 gap-y-10 md:grid-cols-3"
      >
        {INSTRUMENTOS.map((i) => (
          <article key={i.nome} className="border-t border-line pt-6">
            <h2 className="text-2xl leading-snug">{i.nome}</h2>
            <p className="mt-1 text-mute">{i.descricao}</p>
            <p className="mt-4 border-l-2 border-accent pl-4 font-serif italic leading-snug">“{i.citacao}”</p>
          </article>
        ))}
      </div>

      {/* Ingredientes Comuns */}
      <div
        role="tabpanel"
        id={`${uid}-panel-ingredientes`}
        aria-labelledby={`${uid}-tab-ingredientes`}
        hidden={tab !== 'ingredientes'}
      >
        {tab === 'ingredientes' && <IngredientesComuns />}
      </div>

      {/* Glossário */}
      <div
        role="tabpanel"
        id={`${uid}-panel-glossario`}
        aria-labelledby={`${uid}-tab-glossario`}
        hidden={tab !== 'glossario'}
      >
        {tab === 'glossario' && <Glossario />}
      </div>
    </section>
  );
}
