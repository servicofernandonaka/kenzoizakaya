import { useState } from 'react';
import type { Categoria, Receita } from '../types';

/** Paleta terrosa de cada categoria para a capa ilustrada (usada enquanto a receita não tem foto). */
const PALETA: Record<Categoria, [string, string]> = {
  bases: ['#B98A3E', '#5E3D14'],
  tsukemono: ['#7A9A62', '#2E4430'],
  shirumono: ['#B8693E', '#55291A'],
  agemono: ['#C99A4A', '#6E4812'],
  yakimono: ['#A8503A', '#4E1D15'],
  nimono: ['#8A6247', '#37241A'],
  menrui: ['#C7AA73', '#5F4A2B'],
  donburi: ['#9B4545', '#3E1717'],
};

/**
 * Capa da receita: usa `foto` quando existir (public/fotos/...); caso contrário (ou se a imagem falhar),
 * mostra uma capa ilustrada sóbria com o nome em japonês — nunca fica um buraco na vitrine.
 * `className` controla a proporção (aspect-[4/3], aspect-[16/9]...). `eager` = imagem principal da página (sem lazy-load).
 */
export function RecipeCover({ receita, className = '', eager = false }: { receita: Receita; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (receita.foto && !failed) {
    return (
      <img
        src={receita.foto}
        alt={`Foto de ${receita.titulo_pt}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  const [a, b] = PALETA[receita.categoria];
  const len = Array.from(receita.titulo_jp).length;
  const size = len <= 3 ? 'text-8xl' : len <= 5 ? 'text-6xl' : len <= 8 ? 'text-5xl' : 'text-4xl';

  return (
    <div aria-hidden="true" className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(145deg, ${a} 0%, ${b} 100%)` }}>
      <span
        lang="ja"
        className={`absolute inset-0 flex select-none items-center justify-center px-4 text-center font-serif font-semibold leading-tight text-white/25 ${size}`}
      >
        {receita.titulo_jp}
      </span>
    </div>
  );
}
