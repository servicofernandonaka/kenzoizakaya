import { Lantern } from '../components/Icons';
import { RecipeCard } from '../components/RecipeCard';
import type { Receita } from '../types';

interface Props {
  receitas: Receita[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const PILARES: Array<{ titulo: string; texto: string; href?: string }> = [
  { titulo: 'Kihon (O Alicerce)', texto: 'A física e a química dos caldos, cortes e temperaturas.', href: '#/fundamentos' },
  { titulo: 'Caderno da Tomesan', texto: 'Receitas com gramaturas exatas para balança, sem adivinhações.', href: '#/receitas' },
  { titulo: 'Dōgu (As Ferramentas)', texto: 'O que realmente importa na sua gaveta de utensílios.', href: '#/fundamentos' },
  { titulo: 'Mercado Honesto', texto: 'O caminho direto para encontrar insumos puros, sem cair em armadilhas de rótulo.', href: '#/mercado' },
];

export function Home({ receitas, favorites, onToggleFavorite }: Props) {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 text-center shadow-panel sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-lantern/25 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex justify-center">
            <Lantern size={72} />
          </div>
          <h1 className="mt-6 font-serif text-5xl font-bold leading-tight sm:text-7xl" lang="ja">
            居酒屋 賢三
          </h1>
          <p className="mt-2 font-serif text-2xl text-lanternink sm:text-3xl">Izakaya do Kenzō</p>
          <p className="mt-5 text-xl font-medium sm:text-2xl">Onde a tradição centenária não aceita atalhos.</p>

          <div className="mx-auto mt-8 max-w-2xl space-y-4 text-left text-lg leading-relaxed text-mute">
            <p className="text-center text-ink">Bem-vindo ao caderno secreto da nossa família.</p>
            <p>
              Aqui não há espaço para pós instantâneos de laboratório, caldos sem alma ou receitas apressadas da internet moderna. A
              verdadeira culinária japonesa (<em>Washoku</em>) repousa sobre quatro pilares silenciosos: o respeito pelo tempo de cada
              ingrediente, a extração pura do umami natural através do fogo manso, a ordem ancestral do <em>Sa-Shi-Su-Se-So</em> e a
              harmonia sagrada do <em>Ichijū-Sansai</em> (uma sopa, três pratos e uma tigela de gohan fresco).
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#/receitas" className="btn btn-lantern min-h-[56px] px-8 text-lg">
              Abrir o caderno
            </a>
            <a href="#/mercado" className="btn min-h-[56px] px-8 text-lg">
              Mercado honesto
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="pilares">
        <h2 id="pilares" className="text-3xl font-bold">
          Fórmulas testadas por mais de cem anos de bancada
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {PILARES.map((p) => (
            <li key={p.titulo} className="panel p-5">
              <h3 className="text-xl font-bold">
                {p.href ? (
                  <a href={p.href} className="text-lanternink underline-offset-4 hover:underline">
                    {p.titulo} →
                  </a>
                ) : (
                  p.titulo
                )}
              </h3>
              <p className="mt-1 text-mute">{p.texto}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-serif text-xl italic text-mute">
          Puxe um banquinho de madeira, mantenha a faca afiada e respeite o fogo.
        </p>
      </section>

      <section aria-labelledby="cardapio">
        <div className="flex items-end justify-between gap-3">
          <h2 id="cardapio" className="text-3xl font-bold">
            No cardápio de hoje
          </h2>
          <a href="#/receitas" className="btn btn-ghost text-lanternink">
            Ver tudo →
          </a>
        </div>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {receitas.slice(0, 3).map((r) => (
            <li key={r.id} className="flex">
              <div className="flex-1">
                <RecipeCard receita={r} favorite={favorites.includes(r.id)} onToggleFavorite={onToggleFavorite} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
