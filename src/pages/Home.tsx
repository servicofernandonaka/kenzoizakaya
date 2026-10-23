import { Lantern } from '../components/Icons';
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
  { titulo: 'Fundamentos', texto: 'Dashi, cortes, ferramentas e a despensa: a física e a química por trás de cada prato.', href: '#/fundamentos' },
  { titulo: 'O Diário de Receitas', texto: 'Gramaturas exatas para a balança, timers e um modo de leitura feito para a bancada.', href: '#/receitas' },
  { titulo: 'Mercado Honesto', texto: 'O caminho direto para insumos puros, sem cair em armadilhas de rótulo.', href: '#/mercado' },
];

export function Home({ receitas, favorites, onToggleFavorite }: Props) {
  const destaque = receitas.find((r) => r.id === DESTAQUE) ?? receitas[0];
  const doDiario = DO_DIARIO.map((id) => receitas.find((r) => r.id === id)).filter((r): r is Receita => r !== undefined);

  return (
    <div className="space-y-20">
      {/* Capa editorial */}
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div>
          <p className="kicker">Diário &amp; Laboratório Culinário</p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.05] sm:text-6xl">
            Receitas de casa, feitas com calma e precisão.
          </h1>
          <p className="mt-5 max-w-xl text-xl leading-relaxed text-mute">
            O caderno particular do Kenzo: {receitas.length} receitas clássicas da culinária japonesa, com gramaturas exatas,
            timers e um modo de leitura pensado para a bancada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#/receitas" className="btn btn-lantern min-h-[56px] px-8 text-lg">
              Abrir o diário
            </a>
            <a href="#historia" className="btn min-h-[56px] px-8 text-lg" onClick={(e) => { e.preventDefault(); document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Conhecer o Kenzo
            </a>
          </div>
        </div>

        {destaque && (
          <a
            href={hrefReceita(destaque.id)}
            className="group block overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card transition-transform duration-300 ease-out hover:-translate-y-1"
          >
            <RecipeCover receita={destaque} className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
            <span className="block p-6">
              <span className="kicker">Em destaque · {CATEGORIA_LABEL(destaque.categoria)}</span>
              <span className="mt-2 block font-serif text-2xl font-bold leading-snug">{destaque.titulo_pt}</span>
              <span className="mt-2 block text-mute">{destaque.subtitulo}</span>
            </span>
          </a>
        )}
      </section>

      {/* História do personagem */}
      <section
        id="historia"
        aria-labelledby="historia-titulo"
        className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-12 shadow-panel sm:px-12 sm:py-16"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lantern/15 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-line bg-raised/60">
              <Lantern size={64} />
            </div>
            <p className="mt-6 font-serif text-5xl font-bold" lang="ja">
              賢三
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-mute">Kenzo · o cozinheiro de casa</p>
          </div>

          <div>
            <p className="kicker">Quem cozinha aqui</p>
            <h2 id="historia-titulo" className="mt-3 text-4xl font-bold leading-tight">
              Kenzo e o laboratório particular
            </h2>
            <div className="reading mt-6 space-y-5 text-mute">
              <p className="dropcap">
                Kenzo é o alter ego de quem escreve estas páginas: um cozinheiro de casa que decidiu tratar a própria cozinha como
                um laboratório particular. Nada de pó instantâneo e nada de pressa. Só fogo manso, balança e caderno.
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
            <blockquote className="mt-8 border-l-4 border-lantern pl-5 font-serif text-2xl italic leading-snug">
              Puxe um banquinho de madeira, mantenha a faca afiada e respeite o fogo.
              <footer className="mt-2 font-sans text-sm not-italic text-mute">— Kenzo (賢三)</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Do diário */}
      <section aria-labelledby="do-diario">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="kicker">O Diário de Receitas</p>
            <h2 id="do-diario" className="mt-2 text-4xl font-bold">
              Para começar hoje
            </h2>
          </div>
          <a href="#/receitas" className="btn btn-ghost text-lanternink">
            Ver todas as {receitas.length} →
          </a>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doDiario.map((r) => (
            <li key={r.id}>
              <RecipeCard receita={r} favorite={favorites.includes(r.id)} onToggleFavorite={onToggleFavorite} />
            </li>
          ))}
        </ul>
      </section>

      {/* Pilares */}
      <section aria-labelledby="pilares">
        <h2 id="pilares" className="sr-only">
          Explore o laboratório
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {PILARES.map((p) => (
            <li key={p.titulo}>
              <a href={p.href} className="panel group block h-full p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-mute/60">
                <h3 className="text-xl font-bold text-lanternink">{p.titulo} →</h3>
                <p className="mt-2 leading-relaxed text-mute">{p.texto}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
