import { BotanicalSEO, BotanicalCategory } from '../../../types';

interface SeoInput {
  popularName: string;
  botanicalName?: string;
  category?: BotanicalCategory;
  medicinalProperties?: string[];
  spiritualProperties?: string[];
  element?: string;
  chakra?: string;
  historicalOrigin?: string;
}

/**
 * Auto-generates structured, high-ranking SEO metadata for Botanical Library CMS entries.
 */
export function generateBotanicalSEO(input: SeoInput): BotanicalSEO {
  const popular = (input.popularName || 'Planta Sagrada').trim();
  const botanical = (input.botanicalName || '').trim();
  const category = (input.category || 'Ervas').trim();
  const element = (input.element || 'Geral').trim();
  const chakra = (input.chakra || '').trim();

  const slug = popular
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Meta Title Generation (50-60 chars target)
  let metaTitle = `${popular}`;
  if (botanical) {
    metaTitle += ` (${botanical})`;
  }
  metaTitle += `: Guia de ${category} & Usos Alquímicos | OMIAA`;

  // Truncate if too long
  if (metaTitle.length > 70) {
    metaTitle = `${popular}: Guia Completo de ${category} | OMIAA`;
  }

  // Meta Description Generation (120-160 chars target)
  const medProps = (input.medicinalProperties || []).slice(0, 2).join(', ');
  const spirProps = (input.spiritualProperties || []).slice(0, 2).join(', ');

  let desc = `Descubra tudo sobre ${popular}${botanical ? ` (${botanical})` : ''} na categoria ${category}. `;
  if (medProps) {
    desc += `Propriedades medicinais: ${medProps}. `;
  }
  if (spirProps) {
    desc += `Usos espirituais: ${spirProps}. `;
  }
  if (element) {
    desc += `Elemento ${element}. `;
  }
  desc += `Aprenda o modo de preparo ancestral na Omiaá Alquimia Ancestral.`;

  // Trim to approx 160 characters
  if (desc.length > 165) {
    desc = desc.slice(0, 162) + '...';
  }

  // Auto Keywords Generation
  const keywordsSet = new Set<string>([
    popular,
    category,
    `Propriedades de ${popular}`,
    `Como usar ${popular}`,
    `Banho de ${popular}`,
    `Defumação com ${popular}`,
    `Fitoterapia ${category}`,
    `Alquimia Botânica`,
    `OMIAÁ Alquimia Ancestral`
  ]);

  if (botanical) keywordsSet.add(botanical);
  if (element) keywordsSet.add(`Elemento ${element}`);
  if (chakra) keywordsSet.add(`Chakra ${chakra}`);
  (input.medicinalProperties || []).forEach((p) => keywordsSet.add(p));
  (input.spiritualProperties || []).forEach((p) => keywordsSet.add(p));

  const keywords = Array.from(keywordsSet).slice(0, 12);

  return {
    metaTitle,
    metaDescription: desc,
    keywords,
    canonicalSlug: `/botanica/${slug}`
  };
}

/**
 * Calculates a basic SEO score (0 - 100) based on title, description and keyword richness.
 */
export function calculateSeoScore(seo?: BotanicalSEO): { score: number; level: 'Fraco' | 'Bom' | 'Excelente'; feedback: string[] } {
  if (!seo) {
    return { score: 0, level: 'Fraco', feedback: ['SEO não configurado. Clique em Gerar SEO Automático.'] };
  }

  const feedback: string[] = [];
  let score = 0;

  // Meta Title Check
  const titleLen = seo.metaTitle?.length || 0;
  if (titleLen >= 30 && titleLen <= 65) {
    score += 35;
  } else if (titleLen > 0) {
    score += 15;
    feedback.push('Título SEO deve ter idealmente entre 35 e 65 caracteres.');
  } else {
    feedback.push('Título SEO ausente.');
  }

  // Meta Description Check
  const descLen = seo.metaDescription?.length || 0;
  if (descLen >= 110 && descLen <= 165) {
    score += 35;
  } else if (descLen > 0) {
    score += 15;
    feedback.push('Meta descrição deve ter entre 110 e 160 caracteres.');
  } else {
    feedback.push('Meta descrição ausente.');
  }

  // Keywords Check
  const kwCount = seo.keywords?.length || 0;
  if (kwCount >= 5) {
    score += 30;
  } else if (kwCount > 0) {
    score += 15;
    feedback.push('Adicione mais palavras-chave (ideal pelo menos 5).');
  } else {
    feedback.push('Nenhuma palavra-chave informada.');
  }

  let level: 'Fraco' | 'Bom' | 'Excelente' = 'Fraco';
  if (score >= 80) level = 'Excelente';
  else if (score >= 50) level = 'Bom';

  if (feedback.length === 0) {
    feedback.push('Sua meta-tag e estrutura SEO estão otimizadas para os buscadores!');
  }

  return { score, level, feedback };
}
