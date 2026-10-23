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

/** Texto de abertura exibido na página de receitas quando a categoria é selecionada. */
export const CATEGORIA_INTROS: Partial<Record<Categoria, string>> = {
  bases:
    'Na cozinha de um verdadeiro shokudo ou izakaya tradicional, o dashi não é apenas um caldo: é a alma líquida que sustenta o umami de quase todos os preparos, do misoshiru aos cozidos lentos.',
  agemono:
    'No izakaya, o balcão nunca descansa do som de óleo borbulhando. O verdadeiro agemono não é pesado nem encharcado: exige óleo limpo, temperatura rigorosa e controle da umidade para uma crosta crocante e seca por fora e um interior suculento e fumegante.',
};
