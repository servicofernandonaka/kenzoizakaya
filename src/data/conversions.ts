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
  'Missô (pasta de soja fermentada)': { metric: 'g', unit: 'colher_sopa', perUnit: 18, qualifier: ['cheia', 'cheias'] },
  'Tofu em cubos ou Aburaage': { metric: 'g', unit: 'xicara', perUnit: 150 },
  'Wakame desidratada': { metric: 'g', unit: 'colher_sopa', perUnit: 2 },
  'Cebolinha fina (negi)': { metric: 'g', unit: 'colher_sopa', perUnit: 3 },

  'Água ou Dashi base': { metric: 'ml', unit: 'xicara', perUnit: 240 },
  'Saquê culinário seco': { metric: 'ml', unit: 'xicara', perUnit: 240 },
  'Mirin autêntico (Hon-Mirin)': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Açúcar cristal ou mascavo': { metric: 'g', unit: 'colher_sopa', perUnit: 12 },
  'Shoyu tradicional de fermentação natural': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Mostarda japonesa Karashi': { metric: 'g', unit: 'colher_cha', perUnit: 5 },

  'Amido de milho + 1 colher de shoyu': { metric: 'g', unit: 'colher_cha', perUnit: 3 },
  'Cogumelos frescos (Portobello ou Shiitake)': { metric: 'g', unit: 'xicara', perUnit: 70 },
  'Moyashi (broto de feijão fresco)': { metric: 'g', unit: 'xicara', perUnit: 90 },
  'Óleo de gergelim torrado': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },

  'Sal refinado': { metric: 'g', unit: 'colher_cha', perUnit: 6, qualifier: ['rasa', 'rasas'] },
  'Alga Wakame desidratada': { metric: 'g', unit: 'colher_sopa', perUnit: 2 },
  'Vinagre de arroz fermentado puro': { metric: 'ml', unit: 'colher_sopa', perUnit: 15 },
  'Açúcar cristal ou refinado': { metric: 'g', unit: 'colher_sopa', perUnit: 12, qualifier: ['rasa', 'rasas'] },
  'Gergelim torrado branco e preto (iri-goma)': { metric: 'g', unit: 'colher_sopa', perUnit: 9 },
};
