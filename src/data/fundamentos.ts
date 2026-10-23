/* Conteúdo da seção "Bases, Técnicas & Ferramentas" (Fundamentos do Oyaji). */

export type FundamentoTabId = 'dashi' | 'preparo' | 'instrumentos' | 'ingredientes' | 'glossario';

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
  itens?: string[];
  citacao?: string;
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
  { id: 'ingredientes', emoji: '🧂', label: 'Ingredientes Comuns' },
  { id: 'glossario', emoji: '📖', label: 'Glossário' },
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
      'Com o kombu fora, deixe a água ferver em borbulhas fortes, jogue o katsuobushi e apague o fogo na hora: o choque térmico solta o inosinato. Deixe afundar por 2 min e coe com pano sem espremer.',
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
  {
    titulo: 'Dashi Rápido de Emergência (Kombu & Bonito Base)',
    selo: 'Emergência',
    descricao: 'Para quando há pressa no balcão: sem molho prévio do kombu.',
    receitaId: 'dashi-rapido',
    proporcao: '1000ml de água | 1 tira de 15cm de Kombu (cerca de 10g) | 25g de Katsuobushi',
    passos: [
      'Coloque a água e o kombu picado no fogo médio e retire o kombu assim que ferver.',
      'Adicione o katsuobushi, ferva por 1 minuto, desligue e decante por 1 minuto antes de coar rapidamente.',
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

export const PILARES_AGEMONO: Tecnica[] = [
  {
    titulo: 'Abura no Ondo (Temperatura do Óleo)',
    descricao: 'No agemono, o termômetro manda: óleo limpo e temperatura rigorosa garantem a crosta seca.',
    itens: [
      'Baixa (160°C - 170°C): vegetais densos e cortes grossos que precisam cozinhar por dentro sem queimar por fora.',
      'Alta (180°C - 190°C): frangos, empanados em panko e frutos do mar que exigem selagem rápida e crosta crocante.',
    ],
  },
  {
    titulo: 'O Teste do Hashi',
    descricao:
      'Insira um hashi de bambu no óleo quente. Se pequenas bolhas subirem de forma contínua e uniforme ao redor da madeira, o óleo está a 170°C-180°C.',
  },
  {
    titulo: 'Abura-kiri (Escorrer o Óleo)',
    descricao:
      'Nunca empilhe as frituras recém-saídas do óleo. Use uma grelha de metal (batto) ou papel absorvente em camada única para que o vapor escape e não amoleça a crosta.',
  },
];

export const PILARES_NIMONO: Tecnica[] = [
  {
    titulo: 'Otoshibuta (A Tampa de Queda)',
    descricao:
      'Tampa de papel manteiga cortada no diâmetro exato da panela e colocada diretamente sobre os ingredientes. Faz o caldo fervente circular uniformemente por cima dos alimentos e evita que batam uns nos outros e quebrem.',
  },
  {
    titulo: 'Ordem de Cozimento (Textura e Firmeza)',
    descricao:
      'Vegetais duros de raiz (cenoura, batata, nabo) cozinham mais devagar; carnes e tofu entram em momentos diferentes para não endurecerem ou desmancharem.',
  },
  {
    titulo: 'Descanso Pós-Cozimento (A Magia do Sabor)',
    descricao:
      'O nimono atinge o ápice de sabor depois de esfriar completamente. É durante o resfriamento que o caldo penetra profundamente nas fibras da carne e dos tubérculos.',
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
