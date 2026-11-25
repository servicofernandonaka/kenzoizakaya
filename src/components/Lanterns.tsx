import { useFestival } from '../context/FestivalContext';

interface L {
  t: number;
  drop: number;
  s: number;
  hue: 'red' | 'orange' | 'pink';
  glyph: string;
  delay: number;
  hideSmall?: boolean;
}

/** t = posição ao longo do fio (0–1); drop = comprimento do cordão; s = escala */
const LANTERNS: L[] = [
  { t: 0.04, drop: 4, s: 0.9, hue: 'red', glyph: '祭', delay: 0 },
  { t: 0.16, drop: 22, s: 1.1, hue: 'orange', glyph: '福', delay: -1.2, hideSmall: true },
  { t: 0.29, drop: 14, s: 0.95, hue: 'red', glyph: '酒', delay: -2.4 },
  { t: 0.42, drop: 32, s: 1.2, hue: 'pink', glyph: '味', delay: -0.6, hideSmall: true },
  { t: 0.5, drop: 40, s: 1.3, hue: 'red', glyph: '旨', delay: -3.1 },
  { t: 0.58, drop: 32, s: 1.2, hue: 'orange', glyph: '宴', delay: -1.9, hideSmall: true },
  { t: 0.71, drop: 14, s: 0.95, hue: 'red', glyph: '祭', delay: -0.3 },
  { t: 0.84, drop: 22, s: 1.1, hue: 'pink', glyph: '福', delay: -2.8, hideSmall: true },
  { t: 0.96, drop: 4, s: 0.9, hue: 'orange', glyph: '酒', delay: -1.5 },
];

const COLORS = {
  red: ['#ff5a4d', '#b3122a'],
  orange: ['#ffb347', '#e0562a'],
  pink: ['#ff7fb0', '#c4246a'],
} as const;

/** Lanterna chōchin: corpo com nervuras, tampas e borla. */
function Lantern({ hue, glyph, id }: { hue: keyof typeof COLORS; glyph: string; id: string }) {
  const [a, b] = COLORS[hue];
  return (
    <svg viewBox="0 0 54 96" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
      </defs>
      <line x1="27" y1="0" x2="27" y2="8" stroke="#2a1608" strokeWidth="2" />
      <rect x="16" y="8" width="22" height="7" rx="2" fill="#2a1608" />
      <ellipse cx="27" cy="46" rx="25" ry="32" fill={`url(#${id})`} />
      {[28, 36, 46, 56, 64].map((y) => (
        <ellipse key={y} cx="27" cy={y} rx={25 * Math.sqrt(1 - ((y - 46) / 32) ** 2)} ry="2.2" fill="none" stroke="rgb(60 10 20 / 0.45)" strokeWidth="1" />
      ))}
      <rect x="16" y="76" width="22" height="7" rx="2" fill="#2a1608" />
      <text x="27" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff3d6" fontFamily="'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif">
        {glyph}
      </text>
      <line x1="27" y1="83" x2="27" y2="92" stroke="#ffd36b" strokeWidth="2" />
      <path d="M22,92 L32,92 L30,96 L24,96 Z" fill="#ffd36b" />
    </svg>
  );
}

/** Fio de lanternas pendurado no topo do hero. Tocar numa lanterna solta brilhinhos. */
export function Lanterns() {
  const fest = useFestival();
  return (
    <div className="fx-lanterns" aria-hidden="true">
      <svg className="fx-string" viewBox="0 0 1000 90" preserveAspectRatio="none">
        <path d="M0,10 Q500,82 1000,10" fill="none" stroke="#2a1608" strokeWidth="2.5" />
      </svg>
      {LANTERNS.map((l, i) => {
        const y = 10 + 144 * l.t * (1 - l.t) / 1; // altura do fio nesse ponto (viewBox 90px de altura)
        return (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className={`fx-lantern ${l.hideSmall ? 'hidden sm:block' : ''}`}
            style={{
              left: `calc(${l.t * 100}% - ${27 * l.s}px)`,
              top: `${y + l.drop - 4}px`,
              ['--s' as string]: l.s,
              ['--i' as string]: i,
              ['--delay' as string]: `${l.delay}s`,
              ['--sway' as string]: `${4.4 + (i % 4) * 0.6}s`,
            }}
            onClick={(e) => fest.sparkleAt(e.currentTarget)}
          >
            <Lantern hue={l.hue} glyph={l.glyph} id={`lan-${i}`} />
          </button>
        );
      })}
    </div>
  );
}
