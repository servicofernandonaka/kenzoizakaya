import { CATEGORIA_LABEL } from '../lib/format';
import { hrefReceita } from '../lib/route';
import type { Receita } from '../types';
import { ClockIcon, HeartIcon, UsersIcon } from './Icons';

interface Props {
  receita: Receita;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function RecipeCard({ receita, favorite, onToggleFavorite }: Props) {
  return (
    <article className="panel group relative flex flex-col p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-lantern/70 hover:shadow-lantern">
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-3xl leading-tight text-lanternink" lang="ja">
          {receita.titulo_jp}
        </p>
        <button
          type="button"
          onClick={() => onToggleFavorite(receita.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remover ${receita.titulo_pt} dos favoritos` : `Favoritar ${receita.titulo_pt}`}
          className={`btn btn-ghost relative z-10 !px-3 ${favorite ? 'text-lanternink' : 'text-mute'}`}
        >
          <HeartIcon filled={favorite} width={24} height={24} />
        </button>
      </div>

      <h3 className="mt-2 text-xl font-bold leading-snug">
        <a
          href={hrefReceita(receita.id)}
          className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-focus"
        >
          {receita.titulo_pt}
        </a>
      </h3>
      <p className="mt-2 flex-1 text-mute">{receita.subtitulo}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        <li className="chip">{CATEGORIA_LABEL[receita.categoria]}</li>
        <li className="chip">
          <ClockIcon width={16} height={16} /> {receita.tempo_minutos} min
        </li>
        <li className="chip">
          <UsersIcon width={16} height={16} /> {receita.rendimento_base_porcoes} porções
        </li>
      </ul>
    </article>
  );
}
