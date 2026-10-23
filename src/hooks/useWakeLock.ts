import { useCallback, useEffect, useRef, useState } from 'react';

export type WakeLockStatus = 'idle' | 'active' | 'unsupported' | 'denied';

/**
 * Screen Wake Lock com reaquisição automática.
 * O navegador libera o lock sempre que a aba fica oculta; ao voltar a `visible` pedimos de novo.
 */
export function useWakeLock(enabled: boolean) {
  const [status, setStatus] = useState<WakeLockStatus>('idle');
  const [detail, setDetail] = useState<string | null>(null);
  const sentinel = useRef<WakeLockSentinel | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const acquire = useCallback(async () => {
    if (!enabledRef.current) return;
    if (!('wakeLock' in navigator)) {
      setStatus('unsupported');
      setDetail('Este navegador não suporta manter a tela ligada.');
      return;
    }
    if (document.visibilityState !== 'visible') return; // será pedido de novo ao voltar
    if (sentinel.current && !sentinel.current.released) return;
    try {
      const s = await navigator.wakeLock.request('screen');
      if (!enabledRef.current) {
        await s.release().catch(() => undefined);
        return;
      }
      sentinel.current = s;
      setStatus('active');
      setDetail(null);
      s.addEventListener('release', () => {
        if (sentinel.current === s) {
          sentinel.current = null;
          setStatus((prev) => (prev === 'active' ? 'idle' : prev));
        }
      });
    } catch (err) {
      setStatus('denied');
      setDetail(err instanceof Error && err.message ? err.message : 'O sistema recusou manter a tela ligada.');
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void acquire();

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      const s = sentinel.current;
      sentinel.current = null;
      if (s && !s.released) void s.release().catch(() => undefined);
      setStatus('idle');
      setDetail(null);
    };
  }, [enabled, acquire]);

  return { status, detail, retry: acquire };
}
