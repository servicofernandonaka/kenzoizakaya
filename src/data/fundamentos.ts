/* Conteúdo da seção "Bases, Técnicas & Ferramentas" (Fundamentos do Oyaji). */

export type FundamentoTabId = 'dashi' | 'preparo' | 'instrumentos';

export interface Base {
  titulo: string;
  selo: string;
  descricao: string;
  proporcao: string;
  passos: string[];
  /** id da receita completa em recipes.json */
  receitaId: string;
}

export interface Tecnica {
  titulo: string;
  descricao: string;
  citacao: string;
}

export interface Instrumento {
  nome: string;
  descricao: string;
  citacao: string;
}

export const INTRO = {
  kicker: 'Shokudo Wisdom & Roots',
  titulo: 'Bases, Técnicas & Ferramentas',
  texto:
    'Na cozinha do Izakaya Kenzo, não há atalhos. O sabor autêntico nasce da proporção exata do dashi, do respeito aos cortes e do aço afiado.',
};

export const TABS: Array<{ id: FundamentoTabId; emoji: string; label: string }> = [
  { id: 'dashi', emoji: '🍲', label: 'As Bases (Dashi)' },
  { id: 'preparo', emoji: '🔪', label: 'Preparo (Shitajishi)' },
  { id: 'instrumentos', emoji: '🏮', label: 'Instrumentos de Ferro' },
];

export const BASES: Base[] = [
  {
    titulo: 'Awase Dashi (Caldo Base Misto)',
    selo: 'Essencial',
    descricao: 'A espinha dorsal de sopas, molhos, nimono e ensopados tradicionais.',
    receitaId: 'awase-dashi',
    proporcao: '1000ml de água | 10g de Kombu | 25g de Katsuobushi',
    passos: [
      'Limpe o Kombu levemente com pano úmido, preservando o pó branco umami.',
      'Hidrate na água fria por 30 minutos. Aqueça em fogo médio.',
      'Segredo do Oyaji: Retire o kombu antes da fervura total (cerca de 80°C) para não amargar.',
      'Desligue o fogo ao ferver o katsuobushi, deixe afundar em 2 min e coe com pano sem espremer.',
    ],
  },
  {
    titulo: 'Shojin Dashi (Vegetariano)',
    selo: 'Vegan',
    descricao: 'Alternativa umami pura combinando alga kombu e cogumelos shiitake secos.',
    receitaId: 'shojin-dashi',
    proporcao: '1000ml de água | 10g de Kombu | 4 Shiitakes Secos',
    passos: [
      'Deixe o kombu e os shiitakes secos de molho na água fria por pelo menos 4 horas.',
      'Aqueça em fogo baixo até quase ferver, retire o kombu e mantenha em brando por 10 min.',
      'Coe o caldo e aproveite os shiitakes reidratados em refogados e cozidos (nimono).',
    ],
  },
  {
    titulo: 'Iriko Dashi / Niboshi Dashi (Anchova Seca)',
    selo: 'Rústico',
    descricao: 'Caldo intenso e rico em minerais, para sopas do dia a dia e pratos com peixe marcante.',
    receitaId: 'iriko-dashi',
    proporcao: '1000ml de água | 30g de Iriko ou Niboshi',
    passos: [
      'Remova a cabeça e as entranhas escuras das anchovas para eliminar o amargor.',
      'Deixe de molho na água fria por 30 minutos.',
      'Ferva, reduza ao mínimo, retire a espuma e cozinhe por 10 a 15 minutos. Coe em malha fina.',
    ],
  },
  {
    titulo: 'Niban Dashi (Segunda Extração)',
    selo: 'Mottainai',
    descricao: 'Zero desperdício: reaproveita o kombu e o bonito do primeiro dashi para cozidos e arroz temperado.',
    receitaId: 'niban-dashi',
    proporcao: 'Resíduos do Awase | 700ml de água | 5g de Katsuobushi fresco',
    passos: [
      'Cubra os resíduos do Awase Dashi com água fresca e junte o katsuobushi extra.',
      'Ferva em fogo médio por 5 minutos e coe espremendo bem desta vez.',
    ],
  },
];

export const TECNICAS: Tecnica[] = [
  {
    titulo: 'Katsuramuki (Descasque em Folha)',
    descricao: 'A técnica milenar de transformar um rabanete (daikon) em uma folha contínua translúcida.',
    citacao:
      'Não force a lâmina. Mantenha o pulso relaxado e gire o daikon contra a faca como se estivesse desenrolando um pergaminho antigo.',
  },
  {
    titulo: 'Shio-furi (Salgamento Prévio)',
    descricao:
      'Polvilhar sal grosso em carnes e peixes para drenar umidade e eliminar odores fortes antes da chapa.',
    citacao:
      'Deixe agir por 15 minutos, passe rapidamente em água corrente fria e seque com papel toalha. O sabor limpo agradece.',
  },
];

export const INSTRUMENTOS: Instrumento[] = [
  {
    nome: 'Donabe',
    descricao: 'Panela de barro refratário para gohan perfeito.',
    citacao: 'Lembre-se do Medatase (ferver mingau de arroz ralo) antes do primeiro uso para selar os poros.',
  },
  {
    nome: 'Suribachi & Surikogi',
    descricao: 'Almofariz estriado e pilão de madeira para gergelim.',
    citacao:
      'Nunca use pilão de metal na cerâmica para não destruir as ranhuras que trituram sem esmagar o óleo.',
  },
  {
    nome: 'Oroshigane',
    descricao: 'Ralador tradicional de dentes cortados à mão.',
    citacao: 'Movimentos circulares para gengibre; lineares e firmes para o rabanete daikon.',
  },
];
