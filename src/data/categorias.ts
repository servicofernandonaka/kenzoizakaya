/** Taxonomia oficial das receitas do Izakaya do Kenzō. */
export const CATEGORIAS = [
  { id: 'bases', nome: 'Bases & Dashi', icone: '🍲' },
  { id: 'tsukemono', nome: 'Conservas (Tsukemono)', icone: '🥒' },
  { id: 'shirumono', nome: 'Caldos e Sopas (Shirumono)', icone: '🥣' },
  { id: 'agemono', nome: 'Frituras (Agemono)', icone: '🍤' },
  { id: 'yakimono', nome: 'Chapa e Grelhados (Yakimono)', icone: '🍳' },
  { id: 'nimono', nome: 'Cozidos Lentos (Nimono)', icone: '🥘' },
  { id: 'donburi', nome: 'Tigelas de Arroz (Donburi)', icone: '🍚' },
] as const;

export type Categoria = (typeof CATEGORIAS)[number]['id'];

export const CATEGORIA_IDS: readonly string[] = CATEGORIAS.map((c) => c.id);

export const getCategoria = (id: Categoria) => CATEGORIAS.find((c) => c.id === id)!;
