/** Barraquinhas (yatai) do festival: uma por categoria. Cores escuras o bastante para texto branco com contraste AAA (≥ 7:1). */
import type { Categoria } from '../types';

export const YATAI: Record<Categoria, { kanji: string; frase: string; c1: string; c2: string }> = {
  bases: { kanji: '出汁', frase: 'A alma do caldo', c1: '#774C07', c2: '#4A2C05' },
  tsukemono: { kanji: '漬物', frase: 'Frescor em conserva', c1: '#1A5F2D', c2: '#0E4220' },
  shirumono: { kanji: '汁物', frase: 'Sopas que abraçam', c1: '#94340F', c2: '#601E07' },
  agemono: { kanji: '揚げ物', frase: 'Crocância que estala', c1: '#6F5003', c2: '#503A02' },
  yakimono: { kanji: '焼き物', frase: 'Chapa, brasa e fumaça', c1: '#A31F3A', c2: '#6A1024' },
  nimono: { kanji: '煮物', frase: 'Cozidos de fogo manso', c1: '#7A4A2B', c2: '#4A2A16' },
  menrui: { kanji: '麺類', frase: 'Macarrão fumegante', c1: '#0A5A6D', c2: '#06404F' },
  donburi: { kanji: '丼', frase: 'Tigelas de arroz', c1: '#7B2C8F', c2: '#4B1A5C' },
};
