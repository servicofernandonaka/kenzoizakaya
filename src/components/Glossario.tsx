import { useId, useMemo, useState } from 'react';
import { GLOSSARIO, GRUPOS_GLOSSARIO } from '../data/glossario';
import { SearchIcon } from './Icons';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Aba Glossário: busca + termos agrupados (princípios, técnicas e utensílios). */
export function Glossario() {
  const uid = useId();
  const [query, setQuery] = useState('');
  const q = norm(query.trim());

  const visiveis = useMemo(
    () => GLOSSARIO.filter((t) => q === '' || norm(`${t.termo} ${t.jp ?? ''} ${t.definicao}`).includes(q)),
    [q],
  );

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-xl">
        <label htmlFor={`${uid}-q`} className="mb-1 block text-sm font-semibold text-mute">
          Buscar termo
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input
            id={`${uid}-q`}
            type="search"
            className="field !pl-12"
            placeholder="mentori, otoshibuta, 面取り…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-mute" aria-live="polite">
          {visiveis.length} de {GLOSSARIO.length} termos
        </p>
      </div>

      {GRUPOS_GLOSSARIO.map((g) => {
        const termos = visiveis.filter((t) => t.grupo === g.id);
        if (termos.length === 0) return null;
        return (
          <section key={g.id} aria-labelledby={`${uid}-${g.id}`}>
            <h2 id={`${uid}-${g.id}`} className="mb-4 text-2xl font-bold">
              {g.titulo}
            </h2>
            <dl className="grid gap-5 md:grid-cols-2">
              {termos.map((t) => (
                <div key={t.id} className="panel p-6">
                  <dt className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-serif text-xl font-bold text-lanternink">{t.termo}</span>
                    {t.jp && (
                      <span lang="ja" className="font-serif text-lg text-mute">
                        ({t.jp})
                      </span>
                    )}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed">{t.definicao}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {visiveis.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-mute">Nenhum termo encontrado para “{query}”.</p>
      )}
    </div>
  );
}
