// Visualizações simuladas: o site não mede audiência, então cada notícia recebe um número
// aleatório mas estável (derivado do slug), sempre acima de 500. Notícias que "bombam" mais
// — destaque, trailer, crítica e títulos com muitas notícias — recebem mais views.
import type { News } from '@/lib/content-shared';

const MIN = 500;

/** Número pseudoaleatório em [0, 1) a partir de um texto (FNV-1a + mistura). */
function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

export function assignViews(list: News[]) {
  // Quantas notícias cada título tem: título muito noticiado = assunto que está bombando.
  const buzz = new Map<string, number>();
  for (const n of list) for (const t of n.titles) buzz.set(t.slug, (buzz.get(t.slug) ?? 0) + 1);

  for (const n of list) {
    const titleBuzz = Math.max(1, ...n.titles.map((t) => buzz.get(t.slug) ?? 1));
    const heat =
      1 +
      (n.featured ? 2 : 0) +
      (n.kind === 'trailer' ? 0.8 : 0) +
      (n.kind === 'critica' ? 0.3 : 0) +
      (n.video ? 0.2 : 0) +
      0.6 * (titleBuzz - 1);
    const r = seeded(n.slug);
    n.views = Math.round(MIN + (300 + 24000 * r * r) * heat ** 1.6);
  }
}
