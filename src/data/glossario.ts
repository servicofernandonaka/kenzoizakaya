/* Glossário do Izakaya do Kenzō — termos que aparecem nas receitas e nos fundamentos. */

export type GrupoGlossarioId = 'principios' | 'tecnicas' | 'utensilios';

export interface Termo {
  id: string;
  termo: string;
  /** escrita em japonês */
  jp?: string;
  definicao: string;
  grupo: GrupoGlossarioId;
  /** grafias reconhecidas nos textos das receitas (sem diferenciar maiúsculas) */
  variantes: string[];
}

export const GRUPOS_GLOSSARIO: Array<{ id: GrupoGlossarioId; titulo: string; intro?: string }> = [
  { id: 'principios', titulo: 'Os Princípios Sagrados' },
  { id: 'tecnicas', titulo: 'Cortes e Técnicas de Precisão' },
  { id: 'utensilios', titulo: 'Utensílios Fundamentais (Dōgu)' },
];

export const GLOSSARIO: Termo[] = [
  {
    id: 'sa-shi-su-se-so',
    termo: 'Sa-Shi-Su-Se-So',
    jp: 'さ・し・す・せ・そ',
    grupo: 'principios',
    definicao:
      'A ordem tradicional em que o açúcar (satō), o sal (shio), o vinagre (su), o molho de soja (shōyu) e o missô (miso) entram na panela. O açúcar vai primeiro porque penetra devagar; vinagre, shoyu e missô entram por último para não perderem o aroma.',
    variantes: ['Sa-Shi-Su-Se-So'],
  },
  {
    id: 'ichiju-sansai',
    termo: 'Ichijū-Sansai',
    jp: '一汁三菜',
    grupo: 'principios',
    definicao:
      'A regra tradicional da harmonia à mesa: uma sopa rica em umami, três pratos e a tigela de arroz quente.',
    variantes: ['Ichijū-Sansai', 'Ichiju-Sansai'],
  },

  {
    id: 'mentori',
    termo: 'Mentori',
    jp: '面取り',
    grupo: 'tecnicas',
    definicao:
      'Aparar as arestas duras das raízes (daikon, cenoura, kabocha) para que não se despedacem no caldo.',
    variantes: ['mentori'],
  },
  {
    id: 'juji-kiri',
    termo: 'Jūji-kiri',
    jp: '十字切り',
    grupo: 'tecnicas',
    definicao: 'O corte em cruz superficial, para o caldo penetrar até ao coração do nabo.',
    variantes: ['jūji-kiri', 'juji-kiri'],
  },
  {
    id: 'shitayude',
    termo: 'Shitayude',
    jp: '下茹で',
    grupo: 'tecnicas',
    definicao:
      'A fervura prévia purificadora da carne de porco e das raízes duras, com gengibre e cebolinha.',
    variantes: ['shitayude'],
  },
  {
    id: 'shio-momi',
    termo: 'Shio-momi',
    jp: '塩揉み',
    grupo: 'tecnicas',
    definicao: 'A desidratação em sal, para garantir a máxima crocância ao pepino do sunomono.',
    variantes: ['shio-momi'],
  },
  {
    id: 'sasagaki',
    termo: 'Sasagaki',
    jp: '笹掻き',
    grupo: 'tecnicas',
    definicao:
      'Técnica de lâmina fina tradicional. Costuma-se aplicar a raízes finas como a cenoura e o gobo, em lascas leves, como folhas de bambu.',
    variantes: ['sasagaki'],
  },
  {
    id: 'usugiri',
    termo: 'Usugiri',
    jp: '薄切り',
    grupo: 'tecnicas',
    definicao:
      'Técnica de lâmina fina tradicional: o corte em fatias finas, como as do pepino do sunomono.',
    variantes: ['usugiri'],
  },

  {
    id: 'otoshibuta',
    termo: 'Otoshibuta',
    jp: '落とし蓋',
    grupo: 'utensilios',
    definicao:
      'Tampa interna flutuante, apoiada diretamente sobre os ingredientes. Pode ser de madeira ou de papel manteiga cortado no diâmetro da panela. Faz o caldo circular por cima dos alimentos e evita que se batam e quebrem.',
    variantes: ['otoshibuta'],
  },
  {
    id: 'yukihira-nabe',
    termo: 'Yukihira Nabe',
    jp: '行平鍋',
    grupo: 'utensilios',
    definicao: 'Panela martelada de alumínio, de condução térmica rápida, com bico dos dois lados e cabo de madeira.',
    variantes: ['yukihira nabe', 'yukihira'],
  },
  {
    id: 'saibashi',
    termo: 'Saibashi',
    jp: '菜箸',
    grupo: 'utensilios',
    definicao: 'Hashis longos de cozedura, para mexer, virar e servir durante o preparo.',
    variantes: ['saibashi'],
  },
  {
    id: 'misokoshi',
    termo: 'Misokoshi',
    jp: '味噌こし',
    grupo: 'utensilios',
    definicao: 'Peneira de missô: dissolve a pasta no caldo sem deixar grumos.',
    variantes: ['misokoshi'],
  },
  {
    id: 'oroshigane',
    termo: 'Oroshigane',
    jp: 'おろし金',
    grupo: 'utensilios',
    definicao: 'O ralador cerâmico ou de cobre, para gengibre, daikon e wasabi.',
    variantes: ['oroshigane'],
  },
];
