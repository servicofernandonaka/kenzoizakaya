/** Telhado de castelo japonês (shiro) com beirais curvos para cima. */
const roof = (cx: number, w: number, y: number, h: number) => {
  const l = cx - w / 2;
  const r = cx + w / 2;
  return `M${l - 38},${y + 16} C${l - 10},${y + 10} ${l + 28},${y - 2} ${l + 64},${y - h} L${r - 64},${y - h} C${r - 28},${y - 2} ${r + 10},${y + 10} ${r + 38},${y + 16} Z`;
};

/** Fileira de janelas acesas. */
const windows = (x0: number, step: number, n: number, y: number, w = 14, h = 20) =>
  Array.from({ length: n }, (_, i) => ({ x: x0 + i * step, y, w, h }));

const WINDOWS = [
  ...windows(252, 56, 10, 262),
  ...windows(322, 56, 7, 190, 13, 18),
  ...windows(392, 56, 4, 128, 12, 16),
  ...windows(468, 32, 2, 68, 11, 14),
  ...windows(118, 36, 2, 262, 12, 18),
  ...windows(826, 36, 2, 262, 12, 18),
];

/** Silhueta de castelo japonês com janelas acesas — peça central do hero e do rodapé. */
export function Castle({ className = '', lit = true }: { className?: string; lit?: boolean }) {
  const body = '#0b0828';
  const rim = 'rgb(255 150 205 / 0.55)';
  return (
    <svg className={className} viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="castle-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1d7a" />
          <stop offset="1" stopColor="#0c0730" />
        </linearGradient>
        <filter id="castle-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* muralha de pedra */}
      <path d="M30,420 Q96,332 150,300 L850,300 Q904,332 970,420 Z" fill="url(#castle-base)" />
      <path d="M150,300 L850,300" stroke={rim} strokeWidth="2" />
      <path d="M150,300 Q96,332 30,420 M850,300 Q904,332 970,420" fill="none" stroke={rim} strokeWidth="1.6" />
      <g stroke="rgb(255 150 205 / 0.16)" strokeWidth="1.4" fill="none">
        <path d="M118,332 L882,332" />
        <path d="M84,364 L916,364" />
        <path d="M54,396 L946,396" />
      </g>

      {/* torres laterais (yagura) */}
      <rect x="98" y="250" width="104" height="52" fill={body} />
      <path d={roof(150, 150, 250, 22)} fill={body} stroke={rim} strokeWidth="1.6" />
      <rect x="798" y="250" width="104" height="52" fill={body} />
      <path d={roof(850, 150, 250, 22)} fill={body} stroke={rim} strokeWidth="1.6" />
      <rect x="196" y="266" width="32" height="36" fill={body} />
      <rect x="772" y="266" width="32" height="36" fill={body} />

      {/* andar 1 */}
      <rect x="220" y="248" width="560" height="54" fill={body} />
      <path d={roof(500, 600, 248, 30)} fill={body} stroke={rim} strokeWidth="1.8" />
      {/* andar 2 */}
      <rect x="290" y="178" width="420" height="44" fill={body} />
      <path d={roof(500, 450, 178, 26)} fill={body} stroke={rim} strokeWidth="1.8" />
      {/* andar 3 */}
      <rect x="360" y="116" width="280" height="40" fill={body} />
      <path d={roof(500, 320, 116, 26)} fill={body} stroke={rim} strokeWidth="1.8" />
      {/* andar 4 */}
      <rect x="425" y="62" width="150" height="30" fill={body} />
      <path d={roof(500, 210, 62, 30)} fill={body} stroke={rim} strokeWidth="1.8" />

      {/* shachihoko (ornamentos do telhado) e bandeira */}
      <path d="M418,34 q-8,-16 6,-22 q-4,10 8,14 q4,6 -4,12 z" fill={body} stroke={rim} strokeWidth="1.2" />
      <path d="M582,34 q8,-16 -6,-22 q4,10 -8,14 q-4,6 4,12 z" fill={body} stroke={rim} strokeWidth="1.2" />
      <line x1="500" y1="32" x2="500" y2="4" stroke={rim} strokeWidth="2" />
      <path d="M500,5 L528,12 L500,19 Z" fill="#ff4f8b" />

      {/* janelas acesas (halo desfocado + vidro) */}
      {lit && (
        <g>
          <g filter="url(#castle-glow)" opacity="0.9">
            {WINDOWS.map((w, i) => (
              <rect key={`g${i}`} x={w.x - 2} y={w.y - 2} width={w.w + 4} height={w.h + 4} rx="3" fill="#ffb347" />
            ))}
          </g>
          {WINDOWS.map((w, i) => (
            <rect
              key={i}
              className="fx-win"
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              rx="2"
              style={{ ['--d' as string]: `${3.2 + (i % 5) * 0.7}s`, ['--delay' as string]: `${(i % 7) * 0.45}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
