import { useEffect, useMemo, useRef, type PointerEvent } from 'react';
import { useFestival } from '../context/FestivalContext';
import { FireworksEngine } from '../lib/fx/engine';
import { Castle } from './Castle';
import { Lanterns } from './Lanterns';

/** Gerador pseudo-aleatório determinístico (estrelas/pétalas iguais em toda renderização). */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TITLE = ['Um', 'festival', 'de', 'sabores', 'do', 'Japão,', 'na', 'sua', 'cozinha.'];

/**
 * Hero: noite de matsuri. Céu com fogos (toque para soltar), lua, castelo japonês iluminado,
 * lanternas balançando, pétalas e vaga-lumes. A cena é sempre noturna, mesmo no tema claro.
 */
export function FestivalHero({ total }: { total: number }) {
  const fest = useFestival();
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<FireworksEngine | null>(null);

  const decor = useMemo(() => {
    const r = rng(2026);
    return {
      stars: Array.from({ length: 70 }, () => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 2.2, d: 2.4 + r() * 4, delay: -r() * 6 })),
      petals: Array.from({ length: 16 }, () => ({ x: r() * 100, w: 8 + r() * 8, dur: 11 + r() * 9, delay: -r() * 18, dx: -60 + r() * 220 })),
      flies: Array.from({ length: 14 }, () => ({ x: 4 + r() * 92, y: 58 + r() * 34, dur: 7 + r() * 7, delay: -r() * 9 })),
    };
  }, []);

  // motor de fogos do hero: show automático enquanto a cena está visível
  useEffect(() => {
    if (!fest.fx || !canvas.current || !root.current) return;
    const e = new FireworksEngine(canvas.current, fest.hooks);
    engine.current = e;
    const io = new IntersectionObserver(
      ([entry]) => {
        e.setVisible(entry.isIntersecting);
        e.setAuto(entry.isIntersecting);
      },
      { threshold: 0.08 },
    );
    io.observe(root.current);
    // abertura: depois que as lanternas acendem, um pequeno final inaugura o festival
    const intro = window.setTimeout(() => e.finale(), 2200);
    return () => {
      window.clearTimeout(intro);
      io.disconnect();
      e.destroy();
      engine.current = null;
    };
  }, [fest.fx, fest.hooks]);

  // paralaxe: ponteiro (--px/--py) e rolagem (--sy), sem re-renderizar o React
  useEffect(() => {
    const el = root.current;
    if (!el || !fest.fx) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--sy', String(Math.min(window.scrollY, 900)));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [fest.fx]);

  const onMove = (e: PointerEvent) => {
    if (!fest.fx || e.pointerType === 'touch') return;
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    root.current?.style.setProperty('--px', String(((e.clientX - r.left) / r.width - 0.5) * 2));
    root.current?.style.setProperty('--py', String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };

  // tocar/clicar no céu lança um foguete até o ponto
  const onDown = (e: PointerEvent) => {
    if (!engine.current || (e.target as HTMLElement).closest('a,button,[data-no-fx]')) return;
    const r = canvas.current?.getBoundingClientRect();
    if (r) engine.current.launch(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      data-theme="dark"
      className="fx-hero relative isolate overflow-hidden text-ink"
      onPointerMove={onMove}
      onPointerDown={onDown}
    >
      <div className="fx-sky absolute inset-0" aria-hidden="true" />

      <div className="fx-stars" aria-hidden="true">
        {decor.stars.map((s, i) => (
          <span key={i} className="fx-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, ['--d' as string]: `${s.d}s`, ['--delay' as string]: `${s.delay}s` }} />
        ))}
      </div>
      <div className="fx-moon" aria-hidden="true" />

      {/* fogos: atrás do castelo, como no show do parque */}
      <canvas ref={canvas} aria-hidden="true" className="fx absolute inset-0 h-full w-full" />

      <div className="fx-layer fx-mount" aria-hidden="true">
        <svg className="absolute bottom-0 h-[44%] w-full" viewBox="0 0 1000 200" preserveAspectRatio="none" focusable="false">
          <path d="M0,200 L0,110 Q80,40 170,96 T340,84 T520,60 T700,92 T860,52 T1000,100 L1000,200Z" fill="#241766" opacity="0.85" />
          <path d="M0,200 L0,140 Q120,96 240,132 T480,120 T720,128 T1000,118 L1000,200Z" fill="#150e44" />
        </svg>
      </div>

      <div className="fx-castle-glow" aria-hidden="true" />
      <div className="fx-layer fx-castle-wrap" aria-hidden="true">
        <Castle className="fx-castle" />
      </div>

      {/* primeiro plano: colinas e sakuras em silhueta */}
      <div className="fx-layer fx-front" aria-hidden="true">
        <svg className="absolute bottom-0 -left-[8%] h-[11%] w-[116%]" viewBox="0 0 1000 120" preserveAspectRatio="none" focusable="false">
          <path d="M0,120 L0,70 Q140,30 300,64 T620,56 T1000,62 L1000,120Z" fill="#07041a" />
          <g fill="#ff9ec8" opacity="0.9">
            <circle cx="70" cy="30" r="22" /><circle cx="108" cy="44" r="18" /><circle cx="44" cy="52" r="16" />
            <circle cx="930" cy="32" r="22" /><circle cx="892" cy="46" r="18" /><circle cx="958" cy="54" r="16" />
          </g>
          <g stroke="#07041a" strokeWidth="6" strokeLinecap="round"><path d="M70,120 L72,52" /><path d="M930,120 L928,54" /></g>
        </svg>
      </div>

      <Lanterns />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {decor.petals.map((p, i) => (
          <span key={i} className="fx-petal" style={{ left: `${p.x}%`, ['--w' as string]: `${p.w}px`, ['--dur' as string]: `${p.dur}s`, ['--delay' as string]: `${p.delay}s`, ['--dx' as string]: `${p.dx}px` }} />
        ))}
        {decor.flies.map((f, i) => (
          <span key={i} className="fx-firefly" style={{ left: `${f.x}%`, top: `${f.y}%`, ['--dur' as string]: `${f.dur}s`, ['--delay' as string]: `${f.delay}s` }} />
        ))}
      </div>

      {/* texto */}
      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-6xl flex-col items-center px-5 pb-[40%] pt-36 text-center sm:pb-[30%] sm:pt-44 lg:items-start lg:justify-center lg:pb-16 lg:pt-40 lg:text-left">
        <div className="fx-scrim pointer-events-none absolute inset-0" aria-hidden="true" />
        <p className="kicker fx-fade-up relative" style={{ ['--delay' as string]: '0.7s' }}>
          <span lang="ja">夏祭り</span> · Matsuri dos sabores
        </p>
        <h1 id="hero-title" className="fx-glow-text relative mt-5 max-w-4xl text-[2.6rem] font-bold leading-[1.08] text-ink sm:text-6xl lg:max-w-xl lg:text-[3.4rem] xl:text-6xl">
          {TITLE.map((w, i) => (
            <span key={i}>
              <span className="fx-word" style={{ ['--w' as string]: i }}>
                {w}
              </span>{' '}
            </span>
          ))}
        </h1>
        <p className="fx-fade-up relative mt-6 max-w-xl text-lg leading-relaxed text-mute sm:text-xl lg:max-w-md" style={{ ['--delay' as string]: '2s' }}>
          {total} receitas com fotos, timers e Modo Cozinha. Acenda as lanternas, toque no céu e solte os fogos.
        </p>
        <div className="fx-fade-up relative mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start" style={{ ['--delay' as string]: '2.3s' }}>
          <a href="#/receitas" className="btn btn-lantern min-h-[60px] px-9 text-lg">
            Entrar no festival
          </a>
          {fest.fx ? (
            <button type="button" className="btn btn-glass min-h-[60px] px-7 text-lg" onClick={() => engine.current?.finale()}>
              <span aria-hidden="true">🎆</span> Soltar fogos
            </button>
          ) : (
            <button type="button" className="btn btn-glass min-h-[60px] px-7 text-lg" onClick={() => fest.setFx(true)}>
              <span aria-hidden="true">✨</span> Ligar os efeitos
            </button>
          )}
        </div>
        {fest.fx && (
          <p className="fx-fade-up fx-pulse-hint relative mt-7 text-sm text-mute" style={{ ['--delay' as string]: '2.8s' }} aria-hidden="true">
            toque em qualquer ponto do céu ↑
          </p>
        )}
      </div>
    </section>
  );
}
