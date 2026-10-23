import { Fragment, useId, useRef, useState, type KeyboardEvent } from 'react';
import { GRUPOS_INGREDIENTES, INGREDIENTES_INTRO, SUBABAS_INGREDIENTES } from '../data/ingredientes';

/** Converte *trecho* em itálico. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Sub-abas dos ingredientes comuns: Miso, Shoyu, Saquê, Mirin e outros pilares. */
export function IngredientesComuns() {
  const uid = useId();
  const [sub, setSub] = useState(SUBABAS_INGREDIENTES[0].id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = SUBABAS_INGREDIENTES.length - 1;
    let to = -1;
    if (e.key === 'ArrowRight') to = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') to = index === 0 ? last : index - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    if (to < 0) return;
    e.preventDefault();
    const id = SUBABAS_INGREDIENTES[to].id;
    setSub(id);
    refs.current[id]?.focus();
  };

  const grupo = GRUPOS_INGREDIENTES.find((g) => g.id === sub) ?? GRUPOS_INGREDIENTES[0];

  return (
    <div className="space-y-6">
      <p className="mx-auto max-w-3xl text-center leading-relaxed text-mute">
        <Rich text={INGREDIENTES_INTRO} />
      </p>

      <div role="tablist" aria-label="Ingredientes comuns" className="flex flex-wrap justify-center gap-2">
        {SUBABAS_INGREDIENTES.map((s, i) => {
          const active = s.id === sub;
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[s.id] = el;
              }}
              id={`${uid}-sub-${s.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${uid}-subpanel`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSub(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`chip !min-h-[48px] cursor-pointer !px-4 text-base transition-[background-color,border-color,color] duration-200 ${
                active ? '!border-lantern !bg-lantern/15 font-bold text-lanternink' : 'hover:border-mute'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${uid}-subpanel`} aria-labelledby={`${uid}-sub-${sub}`} className="space-y-5">
        <header className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{grupo.titulo}</h2>
          {grupo.intro && (
            <p className="mx-auto mt-2 max-w-2xl leading-relaxed text-mute">
              <Rich text={grupo.intro} />
            </p>
          )}
        </header>

        <ul className={`grid gap-5 ${grupo.variantes.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {grupo.variantes.map((v) => (
            <li key={v.nome} className="panel flex flex-col p-6">
              <h3 className="text-xl font-bold text-lanternink">{v.nome}</h3>
              {v.caracteristicas && (
                <p className="mt-3 text-sm leading-relaxed">
                  <strong>Características: </strong>
                  <Rich text={v.caracteristicas} />
                </p>
              )}
              {v.uso && (
                <p className="mt-3 text-sm leading-relaxed">
                  <strong>Uso no Izakaya: </strong>
                  <Rich text={v.uso} />
                </p>
              )}
              {v.descricao && (
                <p className="text-sm leading-relaxed">
                  <Rich text={v.descricao} />
                </p>
              )}
              {v.nota && (
                <p className="mt-4 rounded-xl border border-lantern/50 bg-lantern/10 p-3 text-sm italic">{v.nota}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
