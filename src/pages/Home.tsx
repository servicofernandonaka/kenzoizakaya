import { useEffect, useMemo, useRef } from 'react';
import { FestivalHero } from '../components/FestivalHero';
import { Reveal } from '../components/Reveal';
import { RecipeCover } from '../components/RecipeCover';
import { useFestival } from '../context/FestivalContext';
import { CATEGORIAS } from '../data/categorias';
import { HISTORIA } from '../data/historia';
import { YATAI } from '../data/yatai';
import { useTilt } from '../hooks/useTilt';
import { CATEGORIA_LABEL } from '../lib/format';
import { hrefReceita } from '../lib/route';
import type { Receita } from '../types';
import { ClockIcon, UsersIcon } from '../components/Icons';

interface Props {
  receitas: Receita[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

/** Os queridinhos do festival (ordem do carrossel). */
const CARDAPIO = [
  'buta-no-kakuni-classico',
  'tori-no-karaage',
  'oyakodon',
  'tonkatsu',
  'oden',
  'shoyu-ramen',
  'katsudon',
  'yakitori',
];

function FestaCard({ r }: { r: Receita }) {
  const tilt = useTilt(6);
  return (
    <article className="fx-glowframe group w-[78vw] max-w-[340px] shrink-0 snap-center sm:w-[320px]">
      <a
        href={hrefReceita(r.id)}
        {...tilt}
        className="fx-tilt relative block aspect-[3/4] overflow-hidden rounded-3xl bg-surface text-white outline-offset-4"
      >
        <RecipeCover receita={r} className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-110" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#070518] via-[#070518]/55 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 p-5">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#ffd36b]">{CATEGORIA_LABEL(r.categoria)}</span>
          <span className="mt-1 block font-display text-2xl font-semibold leading-tight">{r.titulo_pt.split(' (')[0]}</span>
          <span className="mt-3 flex items-center gap-4 text-sm text-white/90">
            <span className="tabular inline-flex items-center gap-1.5">
              <ClockIcon width={16} height={16} /> {r.tempo_minutos} min
            </span>
            <span className="tabular inline-flex items-center gap-1.5">
              <UsersIcon width={16} height={16} /> {r.rendimento_base_porcoes} porções
            </span>
          </span>
        </span>
      </a>
    </article>
  );
}

/** Dispara o grande final quando a seção entra na tela (uma vez por visita). */
function FinaleOnView({ children }: { children: React.ReactNode }) {
  const fest = useFestival();
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !fest.fx) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          fest.finale();
        }
      },
      { threshold: 0.65 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fest]);
  return (
    <section ref={ref} aria-labelledby="final-titulo" className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1b1140] via-[#3a1460] to-[#7b2a78] px-6 py-20 text-center text-white sm:py-28" data-theme="dark">
      {children}
    </section>
  );
}

export function Home({ receitas }: Props) {
  const cardapio = CARDAPIO.map((id) => receitas.find((r) => r.id === id)).filter((r): r is Receita => r !== undefined);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    receitas.forEach((r) => (m[r.categoria] = (m[r.categoria] ?? 0) + 1));
    return m;
  }, [receitas]);
  const fest = useFestival();
  const faixa = receitas.map((r) => r.titulo_jp);

  return (
    <div>
      <FestivalHero total={receitas.length} />

      {/* faixa rolando: nomes dos pratos em japonês */}
      <div className="overflow-hidden border-y border-line bg-surface py-4" aria-hidden="true">
        <div className="fx-marquee font-display text-2xl font-semibold text-ink">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {faixa.map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center">
                  <span lang="ja" className="px-6">{t}</span>
                  <span className="text-lanternink">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-28 px-4 pb-24 pt-24 sm:space-y-36 sm:px-6 sm:pt-32">
        {/* cardápio do festival */}
        <section aria-labelledby="cardapio">
          <Reveal>
            <p className="kicker">Os queridinhos do festival</p>
            <h2 id="cardapio" className="fx-shimmer mt-3 text-4xl leading-tight sm:text-5xl">
              Escolha o seu prato
            </h2>
            <p className="mt-3 max-w-xl text-lg text-mute">Arraste para o lado e deixe o cheiro te guiar.</p>
          </Reveal>
          <ul
            className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-2 sm:-mx-6 sm:px-6"
            aria-label="Pratos em destaque"
          >
            {cardapio.map((r) => (
              <li key={r.id} className="shrink-0">
                <FestaCard r={r} />
              </li>
            ))}
            <li className="flex shrink-0 snap-center items-center pr-4">
              <a href="#/receitas" className="btn btn-lantern min-h-[64px] px-8 text-lg">
                Ver as {receitas.length} receitas →
              </a>
            </li>
          </ul>
        </section>

        {/* barraquinhas (yatai) */}
        <section aria-labelledby="yatai">
          <Reveal>
            <p className="kicker">Passeie pelas barraquinhas</p>
            <h2 id="yatai" className="mt-3 text-4xl leading-tight sm:text-5xl">
              Cada barraca, um sabor
            </h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {CATEGORIAS.map((c, i) => {
              const y = YATAI[c.id];
              return (
                <Reveal as="li" key={c.id} delay={(i % 4) * 0.08}>
                  <a
                    href={`#/receitas?cat=${c.id}`}
                    className="fx-stall group block aspect-[4/5] p-4 text-white sm:p-5"
                    style={{ ['--c1' as string]: y.c1, ['--c2' as string]: y.c2 }}
                    onPointerDown={(e) => fest.sparkleAt(e.currentTarget)}
                  >
                    <span className="fx-noren" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, k) => (
                        <span key={k} />
                      ))}
                    </span>
                    <span className="fx-stall-kanji" lang="ja" aria-hidden="true">
                      {y.kanji}
                    </span>
                    <span className="relative flex h-full flex-col justify-end">
                      <span className="text-4xl" aria-hidden="true">
                        {c.icone}
                      </span>
                      <span className="mt-2 block font-display text-xl font-semibold leading-tight sm:text-2xl">{c.nome.replace(/ \(.*\)/, '')}</span>
                      <span className="mt-1 block text-sm text-white/90">{y.frase}</span>
                      <span className="tabular mt-3 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                        {counts[c.id] ?? 0} {(counts[c.id] ?? 0) === 1 ? 'receita' : 'receitas'}
                      </span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* história do Kenzo */}
        <section id="historia" aria-labelledby="historia-titulo" className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a59] via-[#ff4f8b] to-[#7b2a78] shadow-[0_0_90px_10px_rgba(255,79,139,0.45)] lg:mx-0">
              <span className="font-serif text-8xl font-bold text-white" lang="ja" aria-hidden="true">
                賢三
              </span>
            </div>
            <p className="mt-6 text-center text-sm uppercase tracking-[0.2em] text-mute lg:text-left">{HISTORIA.legenda}</p>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <p className="kicker">{HISTORIA.kicker}</p>
            <h2 id="historia-titulo" className="mt-3 text-4xl leading-tight sm:text-5xl">
              {HISTORIA.titulo}
            </h2>
            <div className="reading mt-8 space-y-6 text-mute">
              {HISTORIA.paragrafos.map((p, i) => (
                <p key={i} className={i === 0 ? 'dropcap' : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <blockquote className="mt-10 border-l-4 border-accent pl-6 font-serif text-2xl italic leading-snug">
              {HISTORIA.citacao}
              <footer className="mt-3 font-sans text-sm not-italic text-mute">— {HISTORIA.assinatura}</footer>
            </blockquote>
          </Reveal>
        </section>

        {/* grande final */}
        <FinaleOnView>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 110%, rgb(255 201 74 / 0.4), transparent 70%)' }} />
          <p className="kicker relative">Itadakimasu!</p>
          <h2 id="final-titulo" className="fx-glow-text relative mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
            A festa só começa quando o fogo acende.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/85">Escolha uma receita, ligue o timer e cozinhe com a gente. Cada passo concluído vira comemoração.</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <a href="#/receitas" className="btn btn-lantern min-h-[60px] px-9 text-lg">
              Abrir o Diário
            </a>
            <a href="#/fundamentos" className="btn btn-glass min-h-[60px] px-7 text-lg">
              Aprender o básico
            </a>
          </div>
        </FinaleOnView>
      </div>
    </div>
  );
}
