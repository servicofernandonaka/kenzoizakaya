import { useEffect, useRef, type ReactNode } from 'react';

/** Faz o conteúdo surgir (fade + subida) quando entra na tela. Sem JS/IntersectionObserver: já aparece. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('fx-in');
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('fx-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`fx-reveal ${className}`} style={{ ['--delay' as string]: `${delay}s` }}>
      {children}
    </Tag>
  );
}
