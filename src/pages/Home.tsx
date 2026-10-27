import { RecipeCard } from '../components/RecipeCard';
import { RecipeCover } from '../components/RecipeCover';
import { CATEGORIA_LABEL } from '../lib/format';
import { hrefReceita } from '../lib/route';
import type { Receita } from '../types';

interface Props {
  receitas: Receita[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const DESTAQUE = 'buta-no-kakuni-classico';
const DO_DIARIO = ['misoshiru-autentico', 'tori-no-karaage', 'oyakodon'];

const PILARES: Array<{ titulo: string; texto: string; href: string }> = [
  { titulo: 'Fundamentos', texto: 'Dashi, cortes, ferramentas, despensa e glossário: a técnica por trás de cada prato.', href: '#/fundamentos' },
  { titulo: 'O Diário de Receitas', texto: 'Gramaturas exatas para a balança, timers e um modo de leitura feito para a bancada.', href: '#/receitas' },
  { titulo: 'Mercado Honesto', texto: 'O caminho direto para insumos puros, sem cair em armadilhas de rótulo.', href: '#/mercado' },
];

export function Home({ receitas, favorites, onToggleFavorite }: Props) {
  const destaque = receitas.find((r) => r.id === DESTAQUE) ?? receitas[0];
  const doDiario = DO_DIARIO.map((id) => receitas.find((r) => r.id === id)).filter((r): r is Receita => r !== undefined);

  return (
    <div className="space-y-28 sm:space-y-36">
      {/* Capa: texto à esquerda, imagem deslocada para baixo — assimetria e espaço (Ma) */}
      <section className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pt-10">
          <p className="kicker">Diário &amp; Laboratório Culinário</p>
          <h1 className="mt-6 text-5xl leading-[1.08] sm:text-6xl">Receitas de casa, feitas com calma e precisão.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
            O caderno particular do Kenzo: {receitas.length} receitas clássicas da culinária japonesa, com gramaturas exatas,
            timers e um modo de leitura pensado para a bancada.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#/receitas" className="btn btn-lantern min-h-[56px] px-8 text-lg">
              Abrir o diário
            </a>
            <a
              href="#historia"
              className="font-medium underline decoration-mute underline-offset-8 hover:decoration-ink"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Conhecer o Kenzo
            </a>
          </div>
        </div>

        {destaque && (
          <a href={hrefReceita(destaque.id)} className="group block lg:col-span-5 lg:col-start-8 lg:mt-24">
            <div className="overflow-hidden rounded-2xl">
              <RecipeCover receita={destaque} className="aspect-[4/5] w-full transition-transform duration-500 ease-in-out group-hover:scale-[1.02]" />
            </div>
            <span className="mt-4 block text-sm text-mute">Em destaque · {CATEGORIA_LABEL(destaque.categoria)}</span>
            <span className="mt-1 block font-serif text-2xl font-semibold leading-snug">{destaque.titulo_pt}</span>
          </a>
        )}
      </section>

      {/* História do personagem */}
      <section id="historia" aria-labelledby="historia-titulo" className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <div
            lang="ja"
            aria-hidden="true"
            className="font-serif text-7xl font-semibold before:text-ink/20 before:content-['賢三']"
          />
          <p className="mt-3 text-sm text-mute">Kenzo · o cozinheiro de casa</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-5">
          <p className="kicker">Quem cozinha aqui</p>
          <h2 id="historia-titulo" className="mt-4 text-4xl leading-tight">
            Kenzo e o laboratório particular
          </h2>
          <div className="reading mt-8 space-y-6 text-mute">
            <p className="dropcap">
              Kenzo é o alter ego de quem escreve estas páginas: um cozinheiro de casa que decidiu tratar a própria cozinha como um
              laboratório particular. Nada de pó instantâneo e nada de pressa. Só fogo manso, balança e caderno.
            </p>
            <p>
              O nome vem de um izakaya imaginário: balcão de madeira escura, lanterna vermelha na porta e a voz do Mestre Kenzo
              repetindo que o sabor mora nos detalhes. É dessa voz que saem os alertas das receitas, como em “Ferveu missô, matou o
              aroma!”. Com Tomesan, cada receita passa pela balança antes de entrar no diário.
            </p>
            <p>
              Aqui o laboratório é doméstico de verdade: pratos pensados para a cozinha de casa, com gramas e mililitros exatos,
              tempos cronometrados e um caderno para anotar como ficou hoje. Cozinhar, ajustar, anotar e repetir, até o prato virar
              rotina.
            </p>
          </div>
          <blockquote className="mt-10 border-l-2 border-accent pl-6 font-serif text-2xl italic leading-snug">
            Puxe um banquinho de madeira, mantenha a faca afiada e respeite o fogo.
            <footer className="mt-3 font-sans text-sm not-italic text-mute">— Kenzo (賢三)</footer>
          </blockquote>
        </div>
      </section>

      {/* Do diário */}
      <section aria-labelledby="do-diario">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">O Diário de Receitas</p>
            <h2 id="do-diario" className="mt-3 text-4xl">
              Para começar hoje
            </h2>
          </div>
          <a href="#/receitas" className="btn btn-ghost">
            Ver todas as {receitas.length} →
          </a>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {doDiario.map((r) => (
            <li key={r.id}>
              <RecipeCard receita={r} favorite={favorites.includes(r.id)} onToggleFavorite={onToggleFavorite} />
            </li>
          ))}
        </ul>
      </section>

      {/* Pilares — lista silenciosa com fios */}
      <section aria-labelledby="pilares">
        <h2 id="pilares" className="sr-only">
          Explore o laboratório
        </h2>
        <ul className="grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {PILARES.map((p) => (
            <li key={p.titulo}>
              <a href={p.href} className="group block h-full p-8 transition-colors duration-300 hover:bg-ink/[0.03]">
                <h3 className="text-xl">
                  {p.titulo} <span aria-hidden="true">→</span>
                </h3>
                <p className="mt-3 leading-relaxed text-mute">{p.texto}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
