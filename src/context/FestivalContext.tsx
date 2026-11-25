import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { usePrefs } from '../hooks/useAppState';
import { playBoom, playLaunch, unlockAudio } from '../lib/audio';
import { FireworksEngine, type EngineHooks, type Shape } from '../lib/fx/engine';

interface FestivalApi {
  /** efeitos visuais ligados? */
  fx: boolean;
  /** som dos fogos ligado? */
  som: boolean;
  /** hooks de som para qualquer instância do motor (respeitam a preferência "som") */
  hooks: EngineHooks;
  /** brilhinhos de feedback no centro de um elemento (botão marcado, favorito...) */
  sparkleAt: (el: Element | null | undefined) => void;
  /** foguete grande subindo até o centro/topo do elemento */
  fireworkAt: (el: Element | null | undefined, shape?: Shape) => void;
  /** grande final cobrindo a tela inteira */
  finale: () => void;
  /** liga/desliga o som (o clique destrava o áudio do navegador) */
  setSom: (on: boolean) => void;
  setFx: (on: boolean) => void;
}

const Ctx = createContext<FestivalApi | null>(null);

export function FestivalProvider({ children }: { children: ReactNode }) {
  const [prefs, patchPrefs] = usePrefs();
  const fx = prefs.fx;
  const som = prefs.som;
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<FireworksEngine | null>(null);
  const somRef = useRef(som);
  somRef.current = som;

  const hooks = useMemo<EngineHooks>(
    () => ({
      onLaunch: () => somRef.current && playLaunch(),
      onExplode: (_shape, size) => somRef.current && playBoom(_shape === 'sparkle' ? 0.5 : size),
    }),
    [],
  );

  // reflete a preferência no <html>: o CSS pausa animações decorativas quando os efeitos estão desligados
  useEffect(() => {
    document.documentElement.dataset.fx = fx ? 'on' : 'off';
  }, [fx]);

  // motor global (lazy): só existe enquanto os efeitos estão ligados
  useEffect(() => {
    if (!fx || !canvas.current) {
      engine.current?.destroy();
      engine.current = null;
      return;
    }
    engine.current = new FireworksEngine(canvas.current, hooks);
    return () => {
      engine.current?.destroy();
      engine.current = null;
    };
  }, [fx, hooks]);

  const center = (el: Element | null | undefined) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const sparkleAt = useCallback((el: Element | null | undefined) => {
    const c = center(el);
    if (c) engine.current?.explode(c.x, c.y, 'sparkle', undefined, 0.9);
  }, []);

  const fireworkAt = useCallback((el: Element | null | undefined, shape?: Shape) => {
    const c = center(el);
    if (c) engine.current?.launch(c.x, Math.max(90, c.y - 90), { shape: shape ?? 'heart', size: 1.1 });
  }, []);

  const finale = useCallback(() => engine.current?.finale(), []);

  const setSom = useCallback(
    (on: boolean) => {
      patchPrefs({ som: on });
      if (on) void unlockAudio().then(() => playBoom(0.6));
    },
    [patchPrefs],
  );
  const setFx = useCallback((on: boolean) => patchPrefs({ fx: on }), [patchPrefs]);

  const api = useMemo<FestivalApi>(
    () => ({ fx, som, hooks, sparkleAt, fireworkAt, finale, setSom, setFx }),
    [fx, som, hooks, sparkleAt, fireworkAt, finale, setSom, setFx],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* camada única, acima do conteúdo e sem capturar toques */}
      <canvas ref={canvas} aria-hidden="true" className="fx pointer-events-none fixed inset-0 z-[45] h-full w-full" />
    </Ctx.Provider>
  );
}

export function useFestival(): FestivalApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFestival precisa estar dentro de <FestivalProvider>.');
  return v;
}
