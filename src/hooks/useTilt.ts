import { useCallback, type PointerEvent } from 'react';

/** Inclinação 3D que segue o ponteiro (só mouse/caneta; em toque não faz nada). */
export function useTilt(max = 7) {
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch' || document.documentElement.dataset.fx === 'off') return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
    },
    [max],
  );
  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);
  return { onPointerMove, onPointerLeave };
}
