// Leitura do conteúdo estático em content/ (ver content/README.md).
// Roda só no servidor, durante o build: as páginas saem como HTML estático.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { assignViews } from '@/lib/views';
import { marked } from 'marked';

const CONTENT = path.join(process.cwd(), 'content');

export * from '@/lib/content-shared';
import { kicker, slugify, type Category, type SearchEntry, type Kind, type News, type NewsMeta, type StreamingRelease, type Title, type TitleRef } from '@/lib/content-shared';
import { DEFAULT_LOCALE, LOCALE_INFO, type Locale } from '@/lib/i18n';

function readDir(dir: string) {
  const d = path.join(CONTENT, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.md')).sort();
}

function toDateString(v: unknown) {
  if (v instanceof Date) return v.toISOString();
  return String(v ?? '');
}

// ---------- notícias ----------
// Cada notícia é uma pasta: content/noticias/<slug>/index.md (original pt-BR + metadados)
// e traduções opcionais <locale>.md com title, dek, imageAlt, videoTitle, titles e o corpo.

// Cache só em produção: no `next dev` o conteúdo novo aparece sem reiniciar o servidor.
const CACHE = process.env.NODE_ENV === 'production';
let baseCache: News[] | null = null;
const localeCache = new Map<Locale, News[]>();

function newsDirs() {
  const d = path.join(CONTENT, 'noticias');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(d, e.name, 'index.md')))
    .map((e) => e.name)
    .sort();
}

/** Notícias no original (pt-BR), mais recentes primeiro, com views calculadas. */
function baseNews(): News[] {
  if (baseCache) return baseCache;
  const list: News[] = [];
  for (const slug of newsDirs()) {
    const raw = fs.readFileSync(path.join(CONTENT, 'noticias', slug, 'index.md'), 'utf8');
    const { data, content } = matter(raw);
    if (!data.title || !data.image?.src) continue;
    list.push({
      slug,
      title: data.title,
      dek: data.dek ?? '',
      date: toDateString(data.date),
      category: data.category,
      kind: data.kind ?? 'noticia',
      tags: (data.tags ?? []).map(String),
      platforms: (data.platforms ?? []).map(String),
      titles: (data.titles ?? []).map((t: Omit<TitleRef, 'slug'>) => ({ ...t, slug: slugify(t.name) })),
      image: data.image,
      video: data.video?.youtube ? data.video : undefined,
      featured: Boolean(data.featured),
      views: 0,
      translated: true,
      sources: data.sources ?? [],
      html: marked.parse(content, { async: false }),
    });
  }
  list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  assignViews(list);
  if (CACHE) baseCache = list;
  return list;
}

type Glossary = Record<string, { original?: string } & Record<string, string | undefined>>;
let glossaryCache: Glossary | null = null;

/** content/titulos-es.json: nome do título no Brasil → nome original e nos mercados de língua espanhola. */
function titleGlossary(): Glossary {
  if (glossaryCache) return glossaryCache;
  const f = path.join(CONTENT, 'titulos-es.json');
  let g: Glossary = {};
  try {
    if (fs.existsSync(f)) g = JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    g = {};
  }
  if (CACHE) glossaryCache = g;
  return g;
}

/** Aplica a tradução do idioma, quando existir; o slug dos títulos não muda (as páginas são as mesmas). */
function localize(n: News, locale: Locale): News {
  const file = LOCALE_INFO[locale].contentFile;
  if (!file) return n;
  const glossary = titleGlossary();
  const titleName = (name: string) => glossary[name]?.[file] ?? glossary[name]?.original ?? name;
  const f = path.join(CONTENT, 'noticias', n.slug, `${file}.md`);
  if (!fs.existsSync(f)) return { ...n, translated: false, titles: n.titles.map((t) => ({ ...t, name: titleName(t.name) })) };
  const { data, content } = matter(fs.readFileSync(f, 'utf8'));
  const names: unknown[] = Array.isArray(data.titles) ? data.titles : [];
  return {
    ...n,
    title: data.title ?? n.title,
    dek: data.dek ?? n.dek,
    image: { ...n.image, alt: data.imageAlt ?? n.image.alt },
    video: n.video ? { ...n.video, title: data.videoTitle ?? n.video.title } : undefined,
    titles: n.titles.map((t, i) => ({ ...t, name: typeof names[i] === 'string' && names[i] ? (names[i] as string) : titleName(t.name) })),
    translated: true,
    html: content.trim() ? marked.parse(content, { async: false }) : n.html,
  };
}

export function getAllNews(locale: Locale = DEFAULT_LOCALE): News[] {
  const cached = localeCache.get(locale);
  if (cached) return cached;
  const list = baseNews().map((n) => localize(n, locale));
  if (CACHE) localeCache.set(locale, list);
  return list;
}

/** Versão leve (sem corpo) para listas e componentes de cliente. */
export function meta(n: News): NewsMeta {
  return {
    slug: n.slug, title: n.title, dek: n.dek, date: n.date, category: n.category, kind: n.kind,
    tags: n.tags, platforms: n.platforms, titles: n.titles, image: n.image, video: n.video, featured: n.featured, views: n.views,
    translated: n.translated,
  };
}

export function getNews(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllNews(locale).find((n) => n.slug === slug);
}

export function newsByCategory(locale: Locale, ...c: Category[]) {
  return getAllNews(locale).filter((n) => c.includes(n.category));
}

export function newsByKind(k: Kind, locale: Locale = DEFAULT_LOCALE) {
  return getAllNews(locale).filter((n) => n.kind === k);
}

/**
 * Notícias de séries/streaming de uma plataforma, mais recentes primeiro.
 * Listas gerais (3+ plataformas, ex.: "o que chega no fim de semana") ficam de fora para não repetir em todas as abas.
 */
export function newsByPlatform(platform: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllNews(locale).filter((n) => n.category !== 'filmes' && n.platforms.includes(platform) && n.platforms.length < 3);
}

export function newsByTitle(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllNews(locale).filter((n) => n.titles.some((t) => t.slug === slug));
}

export function allTags() {
  const map = new Map<string, { tag: string; count: number }>();
  for (const n of baseNews()) for (const tag of n.tags) {
    const key = slugify(tag);
    const cur = map.get(key);
    if (cur) cur.count++;
    else map.set(key, { tag, count: 1 });
  }
  return map;
}

export function newsByTag(tagSlug: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllNews(locale).filter((n) => n.tags.some((t) => slugify(t) === tagSlug));
}

/** Mais lidas: notícias da última semana (a partir da mais recente) com mais views; amplia a janela se faltar. */
export function mostRead(limit = 5, exclude: string[] = [], locale: Locale = DEFAULT_LOCALE) {
  const all = getAllNews(locale);
  if (!all.length) return [];
  for (const days of [7, 30, 3650]) {
    const since = Date.parse(all[0].date) - days * 864e5;
    const list = all.filter((n) => !exclude.includes(n.slug) && Date.parse(n.date) >= since);
    if (list.length >= limit || days === 3650) return list.sort((a, b) => b.views - a.views).slice(0, limit);
  }
  return [];
}

/** Notícias publicadas até `days` dias antes da mais recente. */
export function recentNews(days: number, locale: Locale = DEFAULT_LOCALE) {
  const all = getAllNews(locale);
  if (!all.length) return [];
  const since = Date.parse(all[0].date) - days * 864e5;
  return all.filter((n) => Date.parse(n.date) >= since);
}

export function relatedNews(n: News, limit = 4, locale: Locale = DEFAULT_LOCALE) {
  const titleSlugs = n.titles.map((t) => t.slug);
  const tags = n.tags.map(slugify);
  const scored = getAllNews(locale)
    .filter((o) => o.slug !== n.slug)
    .map((o) => ({
      o,
      score:
        o.titles.filter((t) => titleSlugs.includes(t.slug)).length * 5 +
        o.tags.filter((t) => tags.includes(slugify(t))).length * 2 +
        (o.category === n.category ? 1 : 0),
    }))
    .filter((x) => x.score > 1)
    .sort((a, b) => b.score - a.score || Date.parse(b.o.date) - Date.parse(a.o.date));
  return scored.slice(0, limit).map((x) => x.o);
}

// ---------- títulos ----------

const titlesCache = new Map<Locale, Map<string, Title>>();

export function getAllTitles(locale: Locale = DEFAULT_LOCALE): Map<string, Title> {
  const cached = titlesCache.get(locale);
  if (cached) return cached;
  const map = new Map<string, Title>();

  for (const file of readDir('titulos')) {
    const { data, content } = matter(fs.readFileSync(path.join(CONTENT, 'titulos', file), 'utf8'));
    const slug = file.replace(/\.md$/, '');
    map.set(slug, {
      slug,
      name: data.name,
      originalName: data.originalName,
      type: data.type,
      year: data.year,
      genres: data.genres ?? [],
      rating: data.rating != null ? String(data.rating) : undefined,
      runtime: data.runtime,
      seasons: data.seasons,
      release: data.release ? toDateString(data.release).slice(0, 10) : undefined,
      where: data.where ?? [],
      credits: data.credits ?? [],
      cast: data.cast ?? [],
      poster: data.poster,
      backdrop: data.backdrop,
      trailer: data.trailer,
      synopsisHtml: content.trim() ? marked.parse(content, { async: false }) : undefined,
      hasProfile: true,
    });
  }

  // Títulos citados em notícias, mas sem ficha própria, ganham página mínima.
  for (const n of getAllNews(locale)) for (const t of n.titles) {
    if (map.has(t.slug)) continue;
    map.set(t.slug, {
      slug: t.slug, name: t.name, type: t.type, year: t.year, genres: [], where: [], credits: [], cast: [], hasProfile: false,
    });
  }

  if (CACHE) titlesCache.set(locale, map);
  return map;
}

export function getTitle(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getAllTitles(locale).get(slug);
}

/** Imagem de capa de um título: pôster da ficha ou a imagem da notícia mais recente sobre ele. */
export function titleImage(t: Title): string | undefined {
  return t.poster ?? newsByTitle(t.slug)[0]?.image.src;
}

// ---------- em alta ----------

export type Trend = { title: Title; rank: number; move: string; count: number; image?: string };

const DAY = 864e5;

/**
 * Ranking calculado a partir das notícias: títulos mais citados nos últimos 30 dias
 * (a partir da notícia mais recente), com peso maior para as mais novas.
 * O movimento compara com o ranking dos 30 dias anteriores.
 */
export function getTrending(limit = 10, locale: Locale = DEFAULT_LOCALE): Trend[] {
  const news = getAllNews(locale);
  if (!news.length) return [];
  const ref = Date.parse(news[0].date);

  const rank = (from: number, to: number) => {
    const score = new Map<string, number>();
    const count = new Map<string, number>();
    for (const n of news) {
      const age = ref - Date.parse(n.date);
      if (age < from * DAY || age >= to * DAY) continue;
      const w = 1 + (to * DAY - age) / (to * DAY);
      for (const t of n.titles) {
        score.set(t.slug, (score.get(t.slug) ?? 0) + w);
        count.set(t.slug, (count.get(t.slug) ?? 0) + 1);
      }
    }
    const order = [...score.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
    return { order, count };
  };

  const now = rank(0, 30);
  const before = rank(30, 60);
  const titles = getAllTitles(locale);

  return now.order.slice(0, limit).map((slug, i) => {
    const prev = before.order.indexOf(slug);
    const move = prev === -1 ? 'NEW' : prev === i ? '—' : prev > i ? `▲ ${prev - i}` : `▼ ${i - prev}`;
    const title = titles.get(slug)!;
    return { title, rank: i + 1, move, count: now.count.get(slug) ?? 0, image: titleImage(title) };
  });
}

export function trendingTags(limit = 8) {
  const news = baseNews();
  if (!news.length) return [];
  const ref = Date.parse(news[0].date);
  const count = new Map<string, { tag: string; n: number }>();
  for (const n of news) {
    if (ref - Date.parse(n.date) > 30 * DAY) continue;
    for (const tag of n.tags) {
      const k = slugify(tag);
      const cur = count.get(k);
      if (cur) cur.n++;
      else count.set(k, { tag, n: 1 });
    }
  }
  return [...count.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, limit).map(([slug, v]) => ({ slug, tag: v.tag }));
}

// ---------- calendário ----------

function readJson<T>(file: string): T[] {
  const f = path.join(CONTENT, 'calendario', file);
  if (!fs.existsSync(f)) return [];
  try {
    const list = JSON.parse(fs.readFileSync(f, 'utf8'));
    return Array.isArray(list) ? list.sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date)) : [];
  } catch {
    return [];
  }
}

export function getStreamingReleases() {
  return readJson<StreamingRelease>('streaming.json');
}

export const PLATFORMS = ['Netflix', 'HBO Max', 'Prime Video', 'Disney+', 'Apple TV', 'Globoplay'];

// ---------- busca ----------


export function searchIndex(locale: Locale = DEFAULT_LOCALE): SearchEntry[] {
  return getAllNews(locale).map((n) => ({
    slug: n.slug,
    title: n.title,
    dek: n.dek,
    date: n.date,
    kicker: kicker(n, locale),
    tags: n.tags,
    titles: n.titles.map((t) => t.name),
    image: n.image.src,
  }));
}

/** Data ("AAAA-MM-DD") da notícia mais recente — referência estável para o HTML estático. */
export function contentDate() {
  const latest = baseNews()[0];
  return latest ? latest.date.slice(0, 10) : '2026-01-01';
}
