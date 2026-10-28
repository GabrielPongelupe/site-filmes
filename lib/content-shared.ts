// Tipos e funções puras do conteúdo, seguros para componentes de cliente (sem acesso a disco).
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

export type Category = 'filmes' | 'series' | 'streaming';
export type Kind = 'noticia' | 'trailer' | 'bilheteria' | 'critica';

export type Image = { src: string; alt: string; credit?: string };
export type TitleRef = { name: string; type: 'filme' | 'serie'; year?: number; slug: string };

export type NewsMeta = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  category: Category;
  kind: Kind;
  tags: string[];
  platforms: string[];
  titles: TitleRef[];
  image: Image;
  video?: { youtube: string; title?: string };
  featured: boolean;
  /** visualizações (simuladas, ver lib/views.ts) */
  views: number;
  /** false quando a notícia ainda não tem tradução para o idioma pedido (mostra o original) */
  translated: boolean;
};

export type News = NewsMeta & {
  html: string;
  sources: { name: string; url: string }[];
};

export type Title = {
  slug: string;
  name: string;
  originalName?: string;
  type: 'filme' | 'serie';
  year?: number;
  genres: string[];
  rating?: string;
  runtime?: string;
  seasons?: number;
  release?: string;
  where: { name: string; kind: string }[];
  credits: { k: string; v: string }[];
  cast: { name: string; role?: string }[];
  poster?: string;
  backdrop?: string;
  trailer?: string;
  synopsisHtml?: string;
  /** true quando existe ficha em content/titulos; false = título só citado em notícias */
  hasProfile: boolean;
};

export type StreamingRelease = {
  date: string;
  platform: string;
  title: string;
  type: string;
  genre: string;
  poster?: string;
};

export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryLabel(c: Category, locale: Locale = DEFAULT_LOCALE) {
  return getDictionary(locale).category[c];
}

export function kindLabel(k: Kind, locale: Locale = DEFAULT_LOCALE) {
  return getDictionary(locale).kind[k];
}

/** Rótulo curto que aparece acima do título (ex.: FILMES, TRAILER, CRÍTICA). */
export function kicker(n: Pick<NewsMeta, 'category' | 'kind'>, locale: Locale = DEFAULT_LOCALE) {
  const k = getDictionary(locale).kicker;
  if (n.kind === 'trailer') return k.trailer;
  if (n.kind === 'critica') return k.critica;
  if (n.kind === 'bilheteria') return k.bilheteria;
  return k[n.category];
}

export type SearchEntry = { slug: string; title: string; dek: string; date: string; kicker: string; tags: string[]; titles: string[]; image: string };

