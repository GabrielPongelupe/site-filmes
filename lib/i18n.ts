// Idiomas do site, detecção por país e rotas com prefixo de idioma.
// Os textos da interface ficam em lib/dictionaries.ts; as notícias traduzidas em content/noticias/<slug>/<locale>.md.

export const LOCALES = ['pt-br', 'es-es', 'es-419'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt-br';
export const LOCALE_COOKIE = 'spoilado-locale';

export const LOCALE_INFO: Record<Locale, {
  /** atributo lang / hreflang */
  lang: string;
  /** sufixo do arquivo de tradução da notícia (null = original em pt-BR, index.md) */
  contentFile: string | null;
  /** nome no seletor */
  label: string;
  /** rótulo curto (cabeçalho) */
  short: string;
  /** fuso para datas absolutas */
  timeZone: string;
}> = {
  'pt-br': { lang: 'pt-BR', contentFile: null, label: 'Brasil · Português', short: 'BR', timeZone: 'America/Sao_Paulo' },
  'es-es': { lang: 'es-ES', contentFile: 'es-ES', label: 'España · Español', short: 'ES', timeZone: 'Europe/Madrid' },
  'es-419': { lang: 'es-419', contentFile: 'es-419', label: 'Latinoamérica · Español', short: 'LATAM', timeZone: 'America/Mexico_City' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** País (código ISO, ex.: "BR") → idioma do site. */
const COUNTRY_LOCALE: Record<string, Locale> = {
  BR: 'pt-br',
  PT: 'pt-br',
  ES: 'es-es',
  AD: 'es-es',
  ...Object.fromEntries(
    ['MX', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ']
      .map((c) => [c, 'es-419' as Locale]),
  ),
};

export function localeFromCountry(country: string | null | undefined): Locale | undefined {
  return country ? COUNTRY_LOCALE[country.toUpperCase()] : undefined;
}

/** Idioma preferido a partir do cabeçalho Accept-Language (ex.: "es-AR,es;q=0.9,en;q=0.8"). */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | undefined {
  if (!header) return undefined;
  const langs = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of langs) {
    if (tag.startsWith('pt')) return 'pt-br';
    if (tag === 'es-es' || tag === 'es-ad') return 'es-es';
    if (tag.startsWith('es-')) return 'es-419';
    if (tag === 'es') return undefined; // espanhol sem região: decide pelo país
  }
  return undefined;
}

/** Prefixa um caminho interno com o idioma: ("es-es", "/filmes") → "/es-es/filmes". */
export function localePath(locale: Locale, path = '/') {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Troca o idioma de um caminho já prefixado: "/pt-br/noticia/x" → "/es-es/noticia/x". */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join('/').replace(/\/$/, '') || `/${to}`;
}

/** Rotas do site já com o prefixo do idioma. */
export function paths(locale: Locale) {
  const p = (path: string) => localePath(locale, path);
  return {
    home: p('/'),
    noticia: (slug: string) => p(`/noticia/${slug}`),
    titulo: (slug: string) => p(`/titulo/${slug}`),
    tag: (slug: string) => p(`/tag/${slug}`),
    filmes: p('/filmes'),
    series: p('/series'),
    emAlta: p('/em-alta'),
    trailers: p('/trailers'),
    criticas: p('/criticas'),
    bilheteria: p('/bilheteria'),
    busca: p('/busca'),
    sobre: p('/sobre'),
    privacidade: p('/privacidade'),
    emBreve: p('/em-breve'),
    newsletter: p('/newsletter'),
  };
}

/** Plataformas por idioma (a Globoplay só opera no Brasil). */
export function platformsFor(locale: Locale, all: string[]) {
  return locale === 'pt-br' ? all : all.filter((p) => p !== 'Globoplay');
}
