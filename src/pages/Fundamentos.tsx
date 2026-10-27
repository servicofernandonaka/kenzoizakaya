import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Glossario } from '../components/Glossario';
import { IngredientesComuns } from '../components/IngredientesComuns';
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
    <section aria-labelledby={`${uid}-h`} className="space-y-10">
      <header className="mx-auto max-w-2xl text-center">
        <p className="kicker">{INTRO.kicker}</p>
        <h1 id={`${uid}-h`} className="mt-4 text-4xl md:text-5xl">
          {INTRO.titulo}
        </h1>
        <p className="mt-3 leading-relaxed text-mute">{INTRO.texto}</p>
      </header>

      <div role="tablist" aria-label="Fundamentos" className="flex flex-wrap justify-center gap-2 md:gap-3">
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
              className={`btn ${active ? 'btn-lantern' : ''}`}
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
        className="grid gap-6 md:grid-cols-2"
      >
        {BASES.map((b) => (
          <article key={b.titulo} className="panel relative overflow-hidden p-6 md:p-8">
            <div className="relative flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold">{b.titulo}</h2>
              <span className="chip shrink-0 font-mono text-xs">{b.selo}</span>
            </div>
            <p className="relative mt-2 text-sm text-mute">{b.descricao}</p>
            <div className="relative mt-4 rounded-xl border border-line bg-canvas/70 p-4">
              <span className="block font-mono text-xs text-mute">Proporção Sagrada:</span>
              <strong className="mt-1 block text-sm">{b.proporcao}</strong>
            </div>
            <ol className="relative mt-4 space-y-2 text-sm leading-relaxed">
              {b.passos.map((p, i) => {
                const [lead, rest] = p.startsWith('Segredo do Oyaji:') ? ['Segredo do Oyaji:', p.slice(17)] : [null, p];
                return (
                  <li key={i} className="flex gap-2">
                    <strong aria-hidden="true" className="shrink-0 whitespace-nowrap">{i + 1}.</strong>
                    <span>
                      {lead && <em className="font-semibold text-lanternink">{lead}</em>}
                      {rest}
                    </span>
                  </li>
                );
              })}
            </ol>
            <a href={hrefReceita(b.receitaId)} className="btn relative mt-5 w-full">
              Ver ficha completa →<span className="sr-only"> de {b.titulo}</span>
            </a>
          </article>
        ))}
      </div>

      {/* Preparo (Shitajishi) */}
      <div
        role="tabpanel"
        id={`${uid}-panel-preparo`}
        aria-labelledby={`${uid}-tab-preparo`}
        hidden={tab !== 'preparo'}
        className="grid gap-6 md:grid-cols-2"
      >
        {[...TECNICAS, ...PILARES_AGEMONO, ...PILARES_NIMONO].map((t) => (
          <article key={t.titulo} className="panel p-6 md:p-8">
            <h2 className="text-xl font-bold">{t.titulo}</h2>
            <p className="mt-2 text-sm text-mute">{t.descricao}</p>
            {t.itens && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {t.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
            {t.citacao && (
              <blockquote className="mt-4 rounded-xl border border-line bg-canvas/70 p-4 text-sm italic">
                “{t.citacao}”
                <footer className="mt-2 not-italic text-mute">— Mestre Kenzo</footer>
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
        className="grid gap-6 md:grid-cols-3"
      >
        {INSTRUMENTOS.map((i) => (
          <article key={i.nome} className="panel p-6">
            <h2 className="text-lg font-bold text-lanternink">{i.nome}</h2>
            <p className="mt-1 text-sm text-mute">{i.descricao}</p>
            <p className="mt-3 text-sm italic">“{i.citacao}”</p>
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
