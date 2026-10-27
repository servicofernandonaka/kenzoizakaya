import { CATEGORIA_LABEL } from '../lib/format';
import { hrefReceita } from '../lib/route';
import type { Receita } from '../types';
import { ClockIcon, HeartIcon, UsersIcon } from './Icons';
import { RecipeCover } from './RecipeCover';

interface Props {
  receita: Receita;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  /** card largo da grade assimétrica: proporção 16/9 e subtítulo visível */
  wide?: boolean;
  /** nível do título (2 quando o card vem logo abaixo do h1; 3 dentro de uma seção com h2) */
  headingLevel?: 2 | 3;
}

/** Card editorial: imagem em destaque e metadados silenciosos (tempo, porções e uma tag). */
export function RecipeCard({ receita, favorite, onToggleFavorite, wide = false, headingLevel = 3 }: Props) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl">
        <RecipeCover
          receita={receita}
          className={`w-full transition-transform duration-500 ease-in-out group-hover:scale-[1.02] ${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(receita.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remover ${receita.titulo_pt} dos favoritos` : `Favoritar ${receita.titulo_pt}`}
          className={`absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-canvas/90 backdrop-blur transition-colors duration-300 hover:bg-canvas ${
            favorite ? 'text-lanternink' : 'text-ink'
          }`}
        >
          <HeartIcon filled={favorite} width={22} height={22} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <Heading className={`font-serif font-semibold leading-snug ${wide ? 'text-3xl' : 'text-xl'}`}>
          <a
            href={hrefReceita(receita.id)}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-focus"
          >
            {receita.titulo_pt}
          </a>
        </Heading>
        {wide && <p className="mt-2 max-w-xl leading-relaxed text-mute">{receita.subtitulo}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mute">
          <span className="tabular inline-flex items-center gap-1.5">
            <ClockIcon width={16} height={16} /> {receita.tempo_minutos} min
          </span>
          <span className="tabular inline-flex items-center gap-1.5">
            <UsersIcon width={16} height={16} /> {receita.rendimento_base_porcoes} porções
          </span>
          <span className="chip !min-h-[28px] !text-xs">{CATEGORIA_LABEL(receita.categoria)}</span>
        </div>
      </div>
    </article>
  );
}
