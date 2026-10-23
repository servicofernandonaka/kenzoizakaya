import { CATEGORIA_ICONE, CATEGORIA_LABEL } from '../lib/format';
import { hrefReceita } from '../lib/route';
import type { Receita } from '../types';
import { ClockIcon, HeartIcon, UsersIcon } from './Icons';
import { RecipeCover } from './RecipeCover';

interface Props {
  receita: Receita;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

/** Card editorial do diário: capa em destaque, categoria, título, tempo e porções. */
export function RecipeCard({ receita, favorite, onToggleFavorite }: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-panel transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-mute/60 hover:shadow-card">
      <div className="relative overflow-hidden">
        <RecipeCover
          receita={receita}
          className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(receita.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remover ${receita.titulo_pt} dos favoritos` : `Favoritar ${receita.titulo_pt}`}
          className={`absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/45 backdrop-blur transition-[transform,background-color] duration-200 hover:bg-black/60 active:scale-95 ${
            favorite ? 'text-[#FF8A84]' : 'text-white'
          }`}
        >
          <HeartIcon filled={favorite} width={22} height={22} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="kicker flex items-center gap-1.5">
          <span aria-hidden="true">{CATEGORIA_ICONE(receita.categoria)}</span> {CATEGORIA_LABEL(receita.categoria)}
        </p>
        <h3 className="mt-2 text-xl font-bold leading-snug">
          <a
            href={hrefReceita(receita.id)}
            className="after:absolute after:inset-0 after:rounded-3xl focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-focus"
          >
            {receita.titulo_pt}
          </a>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-mute">{receita.subtitulo}</p>

        <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          <li className="chip">
            <ClockIcon width={16} height={16} /> {receita.tempo_minutos} min
          </li>
          <li className="chip">
            <UsersIcon width={16} height={16} /> {receita.rendimento_base_porcoes} porções
          </li>
        </ul>
      </div>
    </article>
  );
}
