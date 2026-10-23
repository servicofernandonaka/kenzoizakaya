import { useState } from 'react';
import { getCategoria } from '../data/categorias';
import type { Categoria, Receita } from '../types';

/** Paleta de cada categoria para a capa ilustrada (usada enquanto a receita não tem foto). */
const PALETA: Record<Categoria, [string, string]> = {
  bases: ['#C98B2B', '#6E4310'],
  tsukemono: ['#6A9A52', '#28442A'],
  shirumono: ['#C4693A', '#5E2916'],
  agemono: ['#DBA842', '#7A4E10'],
  yakimono: ['#BA4A33', '#561A12'],
  nimono: ['#946245', '#3C2517'],
  menrui: ['#D9B76F', '#6F5128'],
  donburi: ['#A83F3F', '#431414'],
};

/**
 * Capa da receita: usa `foto` quando existir (public/fotos/...); caso contrário (ou se a imagem falhar),
 * mostra uma capa ilustrada com o nome em japonês — nunca fica um buraco na vitrine.
 */
export function RecipeCover({ receita, className = '' }: { receita: Receita; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (receita.foto && !failed) {
    return (
      <img
        src={receita.foto}
        alt={`Foto de ${receita.titulo_pt}`}
        loading="lazy"
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
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}
    >
      <div
        className="absolute -right-10 -top-10 h-56 w-56 rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(255 255 255 / .28), transparent 70%)' }}
      />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full border-[18px] border-white/10" />
      <span
        lang="ja"
        className={`absolute inset-0 flex select-none items-center justify-center px-4 text-center font-serif font-bold leading-tight text-white/30 ${size}`}
      >
        {receita.titulo_jp}
      </span>
      <span className="absolute bottom-3 left-4 text-2xl drop-shadow">{getCategoria(receita.categoria).icone}</span>
    </div>
  );
}
