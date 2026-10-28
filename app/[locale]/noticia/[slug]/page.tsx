import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { Highlights, RelatedItem } from '@/components/NewsCards';
import { ShareButtons } from '@/components/ShareButtons';
import { ViewCount } from '@/components/ViewCount';
import { YouTube } from '@/components/YouTube';
import {
  categoryLabel, getAllNews, getNews, getTitle, kicker, meta, mostRead, relatedNews, slugify, titleImage,
} from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { formatDateTime, readingTime } from '@/lib/format';
import { isLocale, LOCALE_INFO, LOCALES, paths, type Locale } from '@/lib/i18n';

// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

/** Versões da mesma notícia nos outros idiomas (SEO / hreflang). */
function alternates(slug: string) {
  return Object.fromEntries(LOCALES.map((x) => [LOCALE_INFO[x].lang, paths(x).noticia(slug)]));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/noticia/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const n = getNews(slug, locale);
  if (!n) return {};
  return {
    title: n.title,
    description: n.dek,
    alternates: { canonical: paths(locale).noticia(slug), languages: alternates(slug) },
    openGraph: { title: n.title, description: n.dek, images: [n.image.src], type: 'article', publishedTime: n.date, locale: LOCALE_INFO[locale].lang },
  };
}

export default async function NoticiaPage({ params }: PageProps<'/[locale]/noticia/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const n = getNews(slug, l);
  if (!n) notFound();

  const t = getDictionary(l);
  const r = paths(l);
  const categoryRoute = { filmes: r.filmes, series: r.series, streaming: r.series };
  const mainTitle = n.titles[0] ? getTitle(n.titles[0].slug, l) : undefined;
  const related = relatedNews(n, 4, l);
  const crumb = n.titles[0]?.name ?? kicker(n, l);

  return (
    <main className="container article-layout">
      <article className="article">
        <nav className="breadcrumb" aria-label={t.article.breadcrumb}>
          <Link href={r.home}>{t.article.home}</Link>
          <span>/</span>
          <Link href={categoryRoute[n.category]}>{categoryLabel(n.category, l)}</Link>
          <span>/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <span className="article__kicker">
          {categoryLabel(n.category, l).toUpperCase()}
          {n.kind !== 'noticia' ? ` · ${kicker(n, l)}` : ''}
          {n.featured ? ` · ${t.home.featured}` : ''}
        </span>
        <h1>{n.title}</h1>
        <p className="article__dek">{n.dek}</p>

        <div className="byline">
          <div className="byline__author">
            <div className="avatar avatar--brand">S</div>
            <div className="byline__name">
              <strong>{t.article.by}</strong>
              <span className="meta-muted">
                {formatDateTime(n.date, l)} · {t.readingTime(readingTime(n.html))}
              </span>
            </div>
          </div>
          <div className="byline__actions">
            <ViewCount views={n.views} l={l} />
            <ShareButtons l={l} />
          </div>
        </div>

        {n.kind === 'trailer' && n.video ? (
          <figure className="article__figure">
            <YouTube id={n.video.youtube} title={n.video.title} size="lg" l={l} />
            <figcaption className="article__caption">{n.video.title ?? t.article.video} · YouTube</figcaption>
          </figure>
        ) : (
          <figure className="article__figure">
            <Media src={n.image.src} alt={n.image.alt} className="article__img" eager />
            <figcaption className="article__caption">
              {n.image.alt}
              {n.image.credit ? `. ${t.article.image}: ${n.image.credit}` : ''}
            </figcaption>
          </figure>
        )}

        <div className="article__body" dangerouslySetInnerHTML={{ __html: n.html }} />

        {n.video && n.kind !== 'trailer' && (
          <div style={{ marginTop: 22 }}>
            <YouTube id={n.video.youtube} title={n.video.title} l={l} />
          </div>
        )}

        {n.sources.length > 0 && (
          <div className="sources">
            <span className="sources__label">{t.article.sources}</span>
            <ul>
              {n.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mainTitle && (
          <Link href={r.titulo(mainTitle.slug)} className="title-box">
            <Media src={titleImage(mainTitle)} alt="" className="title-box__poster" variant="poster" />
            <div className="title-box__info">
              <span className="meta-muted">
                {[t.type[mainTitle.type].toUpperCase(), mainTitle.year, mainTitle.genres[0]?.toUpperCase()].filter(Boolean).join(' · ')}
              </span>
              <span className="title-box__name">{mainTitle.name}</span>
              {mainTitle.where[0] && <span className="title-box__where">{t.article.where}: {mainTitle.where.map((w) => w.name).join(', ')}</span>}
            </div>
            <span className="title-box__cta">{mainTitle.hasProfile ? t.article.fullProfile : t.article.allAbout}</span>
          </Link>
        )}

        <div className="tags">
          {n.tags.map((tag) => (
            <Link key={tag} href={r.tag(slugify(tag))} className="tag">#{tag}</Link>
          ))}
        </div>

        {related.length > 0 && (
          <section className="article-related">
            <h2 className="display">{t.article.readAlso}</h2>
            {related.map((x) => (
              <RelatedItem key={x.slug} n={meta(x)} l={l} />
            ))}
          </section>
        )}
      </article>

      <aside className="article-aside">
        <Ad size="300x250" l={l} />
        <Highlights items={mostRead(5, [n.slug], l).map(meta)} l={l} />
        <Ad size="300x600" l={l} className="sticky-ad" />
      </aside>
    </main>
  );
}
