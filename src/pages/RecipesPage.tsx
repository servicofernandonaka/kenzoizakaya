import { useId, useMemo, useState } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { HeartIcon, SearchIcon } from '../components/Icons';
import { CATEGORIAS, CATEGORIA_INTROS } from '../data/categorias';
import type { Categoria, Receita } from '../types';

interface Props {
  receitas: Receita[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  /** Mostra apenas as N primeiras, sem filtros (uso na home) */
  limit?: number;
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function RecipesPage({ receitas, favorites, onToggleFavorite }: Props) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Categoria | 'todas'>('todas');
  const [onlyFav, setOnlyFav] = useState(false);

  const counts = useMemo(() => {
    const m: Partial<Record<Categoria, number>> = {};
    receitas.forEach((r) => (m[r.categoria] = (m[r.categoria] ?? 0) + 1));
    return m;
  }, [receitas]);

  const visible = useMemo(() => {
    const q = norm(query.trim());
    return receitas.filter(
      (r) =>
        (cat === 'todas' || r.categoria === cat) &&
        (!onlyFav || favorites.includes(r.id)) &&
        (q === '' ||
          norm(
            [r.titulo_pt, r.titulo_jp, r.subtitulo, ...r.ingredientes.map((i) => i.nome)].join(' '),
          ).includes(q)),
    );
  }, [receitas, query, cat, onlyFav, favorites]);

  return (
    <div className="space-y-6">
      <header>
        <p className="kicker">Caderno da Tomesan</p>
        <h1 className="mt-1 text-4xl font-bold">Receitas</h1>
        <p className="mt-2 text-mute">Gramaturas exatas para a balança, sem adivinhações.</p>
      </header>

      <div className="panel space-y-4 p-5">
        <div>
          <label htmlFor={`${uid}-q`} className="mb-1 block text-sm font-semibold text-mute">
            Buscar receita ou ingrediente
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input
              id={`${uid}-q`}
              type="search"
              className="field !pl-12"
              placeholder="missô, kakuni, bifun, pepino…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar por categoria">
          <button
            type="button"
            role="radio"
            aria-checked={cat === 'todas'}
            className={`btn !min-h-[48px] ${cat === 'todas' ? 'btn-lantern' : ''}`}
            onClick={() => setCat('todas')}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={cat === c.id}
              className={`btn !min-h-[48px] ${cat === c.id ? 'btn-lantern' : ''} ${counts[c.id] ? '' : 'opacity-70'}`}
              onClick={() => setCat(c.id)}
            >
              <span aria-hidden="true">{c.icone}</span> {c.nome}
              <span className="tabular text-sm opacity-80">({counts[c.id] ?? 0})</span>
            </button>
          ))}
          <button
            type="button"
            aria-pressed={onlyFav}
            className={`btn !min-h-[48px] ${onlyFav ? 'btn-lantern' : ''}`}
            onClick={() => setOnlyFav((v) => !v)}
          >
            <HeartIcon filled={onlyFav} width={18} height={18} /> Favoritas
          </button>
        </div>
      </div>

      {cat !== 'todas' && CATEGORIA_INTROS[cat] && (
        <p className="rounded-xl border border-line bg-surface p-4 leading-relaxed text-mute">{CATEGORIA_INTROS[cat]}</p>
      )}

      <p className="text-sm text-mute" aria-live="polite">
        {visible.length} de {receitas.length} receitas
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <li key={r.id} className="flex">
              <div className="flex-1">
                <RecipeCard receita={r} favorite={favorites.includes(r.id)} onToggleFavorite={onToggleFavorite} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-mute">
          {onlyFav && favorites.length === 0
            ? 'Você ainda não favoritou nenhuma receita. Toque no coração de um cartão.'
            : cat !== 'todas' && !counts[cat] && query.trim() === ''
              ? 'Ainda não há receitas nesta categoria. O caderno está crescendo.'
              : 'Nenhuma receita encontrada. Tente outro termo.'}
        </p>
      )}
    </div>
  );
}
