import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { RelatedItem } from '@/components/NewsCards';
import { WatchlistButton } from '@/components/WatchlistButton';
import { YouTube } from '@/components/YouTube';
import { getAllTitles, getTitle, getTrending, meta, newsByTitle } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/format';
import { isLocale, LOCALE_INFO, LOCALES, paths, type Locale } from '@/lib/i18n';

// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return [...getAllTitles().keys()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/titulo/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const t = getTitle(slug, locale);
  if (!t) return {};
  const d = getDictionary(locale);
  return {
    title: t.name,
    description: d.title.description(d.type[t.type], t.name),
    alternates: {
      canonical: paths(locale).titulo(slug),
      languages: Object.fromEntries(LOCALES.map((x) => [LOCALE_INFO[x].lang, paths(x).titulo(slug)])),
    },
  };
}

export default async function TituloPage({ params }: PageProps<'/[locale]/titulo/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l: Locale = locale;
  const t = getTitle(slug, l);
  if (!t) notFound();
  const d = getDictionary(l);
  const r = paths(l);

  const news = newsByTitle(t.slug, l);
  const review = news.find((n) => n.kind === 'critica');
  const trailerId = t.trailer ?? news.find((n) => n.video)?.video?.youtube;
  const trend = getTrending(10, l).find((x) => x.title.slug === t.slug);
  const backdrop = t.backdrop ?? news[0]?.image.src;

  const metaLine = [
    d.type[t.type].toUpperCase(),
    t.year && (t.type === 'serie' ? `${t.year}–` : t.year),
    t.seasons && d.title.seasons(t.seasons),
    t.runtime,
    t.rating && (t.rating === 'L' ? d.title.ratingFree : d.title.ratingAge(t.rating)).toUpperCase(),
  ].filter(Boolean).join(' · ');

  const scores = [
    trend && { v: `#${trend.rank}`, l: d.title.trending, accent: true },
    { v: String(news.length), l: d.title.newsCount(news.length), accent: !trend },
    t.release && { v: formatDate(`${t.release}T12:00:00-03:00`, l).replace(/ \d{4}$/, ''), l: d.title.releaseBr(t.release.slice(0, 4)), accent: false },
  ].filter(Boolean) as { v: string; l: string; accent: boolean }[];

  const ficha = [
    t.originalName && t.originalName !== t.name && { k: d.title.originalTitle, v: t.originalName },
    ...t.credits,
    t.release && { k: d.title.releaseBrLabel, v: formatDate(`${t.release}T12:00:00-03:00`, l) },
    t.rating && { k: d.title.rating, v: t.rating === 'L' ? d.title.ratingFree : d.title.ratingAge(t.rating) },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <main>
      <section className="title-hero">
        <Media src={backdrop} alt="" className="title-hero__backdrop" eager />
        <div className="title-hero__shade" />
        <div className={`container title-hero__inner ${t.poster ? '' : 'title-hero__inner--no-poster'}`}>
          {t.poster && <Media src={t.poster} alt={t.name} className="title-hero__poster" eager />}
          <div className="title-hero__info">
            <span className="meta-muted" style={{ fontSize: 12 }}>{metaLine}</span>
            <h1 className="display">{t.name}</h1>
            {t.genres.length > 0 && (
              <div className="pills">
                {t.genres.map((g) => (
                  <span key={g} className="genre-pill">{g}</span>
                ))}
              </div>
            )}
            {t.synopsisHtml ? (
              <div className="title-hero__syn" dangerouslySetInnerHTML={{ __html: t.synopsisHtml }} />
            ) : (
              news[0] && <p className="title-hero__syn">{news[0].dek}</p>
            )}
            <div className="scores">
              {scores.map((s) => (
                <div key={s.l} className="score">
                  <span className="score__v" style={{ color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.v}</span>
                  <span className="score__l">{s.l}</span>
                </div>
              ))}
            </div>
            <div className="title-hero__ctas">
              {trailerId && <a href="#trailer" className="btn btn--primary">{d.title.trailerBtn}</a>}
              <WatchlistButton slug={t.slug} l={l} />
            </div>
          </div>
        </div>
      </section>

      <div className="container title-body">
        <div className="title-body__main">
          {trailerId && (
            <section id="trailer" style={{ scrollMarginTop: 90 }}>
              <h2 className="display">{d.title.trailer}</h2>
              <YouTube id={trailerId} title={`${t.name} · ${d.title.trailer.toLowerCase()}`} size="lg" l={l} />
            </section>
          )}

          {t.cast.length > 0 && (
            <section>
              <h2 className="display">{d.title.cast}</h2>
              <div className="cast">
                {t.cast.slice(0, 6).map((c) => (
                  <div key={c.name} className="cast__item">
                    <div className="cast__photo" aria-hidden="true">
                      {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <span className="cast__name">{c.name}</span>
                    {c.role && <span className="cast__role">{c.role}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {review && (
            <section>
              <h2 className="display">{d.title.critics}</h2>
              <div className="review">
                <div className="review__score">
                  <strong>✦</strong>
                  <span>{d.title.criticsTag}</span>
                </div>
                <div className="review__text">
                  <span className="review__head">{review.title}</span>
                  <p>{review.dek}</p>
                  <Link href={r.noticia(review.slug)}>{d.title.readFull}</Link>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="display" style={{ marginBottom: 6 }}>{d.title.newsOf(t.name)}</h2>
            {news.map((n) => (
              <RelatedItem key={n.slug} n={meta(n)} l={l} />
            ))}
          </section>
        </div>

        <aside className="title-aside">
          {t.where.length > 0 && (
            <div className="card where-card">
              <h3 className="display">{d.title.where}</h3>
              {t.where.map((w) => (
                <div key={w.name} className="where-row">
                  <strong>{w.name}</strong>
                  <span>{w.kind}</span>
                </div>
              ))}
            </div>
          )}
          {ficha.length > 0 && (
            <div className="card ficha">
              <h3 className="display">{d.title.profile}</h3>
              <dl>
                {ficha.map((f) => (
                  <div key={f.k} className="ficha__row">
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Ad size="300x250" l={l} />
          <Link href={r.emAlta} className="see-all">{d.title.seeTrending}</Link>
        </aside>
      </div>
    </main>
  );
}
