import type { Conversion } from '../lib/units';

/**
 * Tabela de equivalência balança <-> medida caseira, por ingrediente (chave = `nome` no recipes.json).
 * `perUnit` = quanto (g ou ml) cabe em UMA medida caseira.
 * Padrões: xícara = 240 ml, colher de sopa = 15 ml, colher de chá = 5 ml.
 * Para sólidos, valores típicos de cozinha doméstica (variam com a marca e o grau de compactação).
 * Ingredientes sem entrada (ex.: panceta, cebola) não possuem medida caseira confiável.
 */
export const CONVERSIONS: Record<string, Conversion> = {
  'Água filtrada': { metric: 'ml', unit: 'xicara', perUnit: 240 },
  'Katsuobushi (lascas de bonito)': { metric: 'g', unit: 'punhado', perUnit: 9 },
  'Katsuobushi (flocos de bonito)': { metric: 'g', unit: 'punhado', perUnit: 9 },
  'Katsuobushi fresco (reforço)': { metric: 'g', unit: 'punhado', perUnit: 9 },
  'Missô (pasta de soja fermentada)': { metric: 'g', unit: 'colher_sopa', perUnit: 18, qualifier: ['cheia', 'cheias'] },
  'Tofu em cubos ou Aburaage': { metric: 'g', unit: 'xicara', perUnit: 150 },
  'Wakame desidratada': { metric: 'g', unit: 'colher_sopa', perUnit: 2 },
  'Cebolinha fina (negi)': { metric: 'g', unit: 'colher_sopa', perUnit: 3 },

  'Amido de milho + 1 colher de shoyu': { metric: 'g', unit: 'colher_cha', perUnit: 3 },
  'Cogumelos frescos (Portobello ou Shiitake)': { metric: 'g', unit: 'xicara', perUnit: 70 },
  'Moyashi (broto de feijão fresco)': { metric: 'g', unit: 'xicara', perUnit: 90 },
  'Óleo de gergelim torrado': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },

  'Saquê culinário (Ryorishu)': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Óleo de gergelim torrado (marinada)': { metric: 'ml', unit: 'colher_cha', perUnit: 5 },
  'Farinha de trigo': { metric: 'g', unit: 'colher_sopa', perUnit: 10 },
  'Farinha Panko': { metric: 'g', unit: 'xicara', perUnit: 80 },

  'Shoyu tradicional': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  Mirin: { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Açúcar mascavo ou cristal': { metric: 'g', unit: 'colher_sopa', perUnit: 15 },
  Açúcar: { metric: 'g', unit: 'colher_sopa', perUnit: 15 },
  'Awase Dashi': { metric: 'ml', unit: 'xicara', perUnit: 240 },

  'Dashi leve': { metric: 'ml', unit: 'xicara', perUnit: 240 },

  'Manteiga sem sal': { metric: 'g', unit: 'colher_sopa', perUnit: 15 },
  'Gengibre fresco ralado': { metric: 'g', unit: 'colher_sopa', perUnit: 15 },
  'Óleo vegetal para refogar': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Óleo vegetal para saltear': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Óleo vegetal para grelhar': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Água (para vaporização)': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Shoyu claro (usukuchi)': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Molho de ostra (oyster)': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Shoyu especial para ramen': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Molho especial para yakisoba': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Sal refinado': { metric: 'g', unit: 'colher_cha', perUnit: 6, qualifier: ['rasa', 'rasas'] },
  'Alga Wakame desidratada': { metric: 'g', unit: 'colher_sopa', perUnit: 2 },
  'Vinagre de arroz fermentado puro': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Açúcar cristal ou refinado': { metric: 'g', unit: 'colher_sopa', perUnit: 12, qualifier: ['rasa', 'rasas'] },
  'Gergelim torrado branco e preto (iri-goma)': { metric: 'g', unit: 'colher_sopa', perUnit: 9 },
};
