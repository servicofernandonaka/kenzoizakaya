/* Compêndio de ingredientes essenciais — texto do Mestre Kenzo. Trechos entre *asteriscos* viram itálico. */

export interface Variante {
  nome: string;
  caracteristicas?: string;
  uso?: string;
  descricao?: string;
  /** destaque (ex.: "Nota do Oyaji") */
  nota?: string;
}

export interface GrupoIngredientes {
  id: string;
  titulo: string;
  intro?: string;
  variantes: Variante[];
}

export const INGREDIENTES_INTRO =
  'Na cozinha de um *izakaya* ou *shokudo* tradicional, os ingredientes não são apenas insumos: eles carregam séculos de fermentação, técnica e respeito à matéria-prima. Este é o guia detalhado pelo Mestre Kenzo sobre os pilares da despensa japonesa.';

export const GRUPOS_INGREDIENTES: GrupoIngredientes[] = [
  {
    id: 'miso',
    titulo: 'Miso (Pasta de Soja Fermentada)',
    intro:
      'O missô é o resultado da fermentação de soja, grãos (arroz ou cevada) e sal com o fungo *Aspergillus oryzae* (*koji*). O tempo de maturação e a proporção de grãos determinam sua cor, teor de sal e intensidade de sabor.',
    variantes: [
      {
        nome: 'Shiro Miso (Missô Branco / Kansai)',
        caracteristicas:
          'Fermentação curta (poucas semanas a alguns meses), alto teor de arroz maltado, cor bege clara a amarelada. Tem sabor suave, adocicado e baixo teor de sal.',
        uso: 'Ideal para sopas leves de verão, marinadas rápidas de peixes brancos (*saikyoyaki*), molhos para saladas e caldos delicados.',
      },
      {
        nome: 'Shinshu Miso / Aka Miso (Missô Vermelho / Amarelo)',
        caracteristicas:
          'O tipo mais consumido no Japão (especialmente em Tóquio). Fermentação mais longa, cor âmbar a avermelhada, sabor encorpado, salgado e umami pronunciado.',
        uso: 'A escolha padrão para o *Misoshiru* clássico de todo dia, molhos robustos e pratos refogados (*itamemono*).',
      },
      {
        nome: 'Hatcho Miso (Missô Escuro de Soja Pura)',
        caracteristicas:
          'Produzido 100% com soja (sem arroz ou cevada), maturação longa de 1 a 3 anos em barris de cedro pesados com pedras. Cor marrom escura quase preta, sabor terroso profundo, amargo na medida certa e sem açúcar residual.',
        uso: 'Cozidos longos de inverno (*Oden*), molhos para pratos de carne suína (*Miso Katsu*) e caldos encorpados.',
      },
      {
        nome: 'Saikyo Miso (Missô Doce de Quioto)',
        caracteristicas:
          'Variante extrema do shiro miso com altíssima proporção de koji de arroz e baixíssimo sal. Extremamente doce, textura de pomada.',
        uso: 'Marinadas de luxo para peixes nobres (como o famoso *Black Cod* ao missô).',
      },
    ],
  },
  {
    id: 'shoyu',
    titulo: 'Shoyu (Molho de Soja Tradicional)',
    intro:
      'O shoyu legítimo japonês (*honke*) é fermentado naturalmente a partir de soja, trigo, água e sal por meses.',
    variantes: [
      {
        nome: 'Koikuchi Shoyu (Shoyu Escuro Tradicional)',
        caracteristicas:
          'Representa cerca de 80% da produção japonesa. Proporção equilibrada de soja e trigo. Cor escura brilhante, aroma complexo e salinidade marcante.',
        uso: 'O coringa universal da cozinha. Usado em marinadas, caldos dashi, guisados (*nimono*) e finalizações.',
      },
      {
        nome: 'Usukuchi Shoyu (Shoyu Claro)',
        caracteristicas:
          'Mais claro na cor que o koikuchi, porém mais salgado. É fermentado com um pouco mais de sal e aditivos leves para evitar o escurecimento.',
        uso: 'Usado quando você quer temperar e salgar o prato sem alterar a cor natural dos ingredientes (como sopas claras *suimono* e cozidos de vegetais brancos).',
      },
      {
        nome: 'Tamari Shoyu',
        caracteristicas:
          'O ancestral do shoyu moderno. Produzido com pouquíssimo ou nenhum trigo (quase 100% soja). É mais denso, escuro, viscoso e rico em umami.',
        uso: 'Excelente para sashimis (por aderir melhor ao peixe) e molhos que exigem corpo denso. Frequentemente naturalmente sem glúten.',
      },
      {
        nome: 'Shiro Shoyu (Shoyu Branco)',
        caracteristicas:
          'Produzido predominantemente com trigo e muito pouco de soja. Cor âmbar translúcida (semelhante a um óleo dourado), sabor levemente adocicado e salgado.',
        uso: 'Preserva a cor original de sopas e macarrões claros, adicionando profundidade de sabor sem escurecer o prato.',
      },
      {
        nome: 'Saishikomi Shoyu (Shoyu de Dupla Fermentação)',
        caracteristicas:
          'Em vez de usar água e sal na fermentação, utiliza shoyu já pronto como líquido base para uma nova fermentação. Denso, rico e adocicado.',
        uso: 'Usado em gotas como finalizador para grelhados especiais.',
      },
    ],
  },
  {
    id: 'sake',
    titulo: 'Sake (Saquê)',
    intro: 'Na culinária japonesa, o saquê divide-se em duas categorias cruciais:',
    variantes: [
      {
        nome: 'Ryorishu (Saquê Culinário)',
        caracteristicas:
          'Saquê destinado à cozinha, ao qual é adicionado sal (geralmente entre 2% a 3%) e dextrina para torná-lo intragável como bebida e isentá-lo de impostos de álcool de mesa.',
        uso: 'Amaciar carnes, remover odores fortes de peixe e aves, e compor a base alcoólica de marinadas.',
        nota: 'Nota do Oyaji: se usar saquê culinário, lembre-se de que ele já contém sal; ajuste o sal do prato para baixo.',
      },
      {
        nome: 'Junmai Sake (Saquê de Mesa / Bebida)',
        caracteristicas: 'Saquê puro de arroz, água e koji, sem álcool aditivo.',
        uso: 'O preferido dos chefs exigentes para cozinhar, pois traz doçura natural e acidez limpa sem o excesso de sal industrial.',
      },
    ],
  },
  {
    id: 'mirin',
    titulo: 'Mirin (Vinho de Arroz Doce)',
    intro: 'Essencial para dar o brilho (*teri*) e a doçura equilibrada aos pratos japoneses.',
    variantes: [
      {
        nome: 'Hon Mirin (Mirin Verdadeiro)',
        caracteristicas:
          'Teor alcoólico natural de cerca de 14%, produzido pela fermentação prolongada de arroz glutinoso (*mochigome*), koji e álcool de cereais. Contém açúcares complexos naturais.',
        uso: 'Cria a glaçagem brilhante em grelhados (*teriyaki*) e suaviza a acidez de cozidos. O álcool evapora no cozimento, deixando apenas o dulçor elegante.',
      },
      {
        nome: 'Mirin-fu (Tempero tipo Mirin)',
        caracteristicas:
          'Condimento industrializado com menos de 1% de álcool, feito de xarope de milho, água, glutamato e ácido lático.',
        uso: 'Alternativa econômica, mas carece da complexidade enzimática do Hon Mirin verdadeiro.',
      },
    ],
  },
  {
    id: 'pilares',
    titulo: 'Outros Pilares da Despensa',
    variantes: [
      {
        nome: 'Kombu & Katsuobushi',
        descricao:
          'A base inegociável do Dashi (alga marinha gigante do norte do Japão e flocos de bonito seco defumado).',
      },
      {
        nome: 'Katakuriko (Amido de Batata)',
        descricao:
          'O agente espessante e empanador padrão do Japão. Diferente do amido de milho ocidental, o katakuriko forma uma crosta mais translúcida e crocante no Karaage.',
      },
      {
        nome: 'Farinha Panko',
        descricao:
          'Farinha de rosca japonesa feita a partir de pão de forma sem casca assado por eletricidade, gerando flocos grandes, arejados e não compactados que absorvem menos óleo na fritura.',
      },
      {
        nome: 'Goma / Gergelim (Shiro e Kura Goma)',
        descricao:
          'Sementes de gergelim branco e preto, torradas na hora no balcão para liberar óleos essenciais antes de serem trituradas no *suribachi*.',
      },
    ],
  },
];

export const SUBABAS_INGREDIENTES: Array<{ id: string; label: string }> = [
  { id: 'miso', label: 'Miso' },
  { id: 'shoyu', label: 'Shoyu' },
  { id: 'sake', label: 'Saquê' },
  { id: 'mirin', label: 'Mirin' },
  { id: 'pilares', label: 'Outros pilares' },
];
