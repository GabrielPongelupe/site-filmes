import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Media } from '@/components/Media';
import { FeedItem, Highlights, ListItem, SideCard, TrailerCard } from '@/components/NewsCards';
import { StreamingTabs } from '@/components/StreamingTabs';
import { TimeAgo } from '@/components/TimeAgo';
import {
  PLATFORMS, categoryLabel, contentDate, getAllNews, getStreamingReleases, getTrending, kicker, meta, mostRead, newsByPlatform, recentNews,
} from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { readingTime } from '@/lib/format';
import { isLocale, paths, platformsFor } from '@/lib/i18n';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  const r = paths(l);

  const all = getAllNews(l);
  if (!all.length) {
    return (
      <main className="container page">
        <p className="empty">{t.home.empty}</p>
      </main>
    );
  }

  // Home sempre "do dia", como os portais de notícia:
  // manchete = destaque mais recente das últimas 48 h (senão, a notícia mais nova com vídeo ou a mais nova).
  const last48h = recentNews(2, l);
  const hero = last48h.find((n) => n.featured) ?? last48h.find((n) => n.video) ?? all[0];
  const side = all.filter((n) => n.slug !== hero.slug).slice(0, 3);
  const used = [hero, ...side].map((n) => n.slug);
  // Últimas: o que saiu nos últimos 10 dias, mais nova primeiro.
  const feed = recentNews(10, l).filter((n) => !used.includes(n.slug)).slice(0, 10);
  const feedUsed = [...used, ...feed.map((n) => n.slug)];
  // Trailers que bombaram: trailers do último mês, ordenados por views.
  const trailers = recentNews(30, l)
    .filter((n) => n.kind === 'trailer' && !used.includes(n.slug))
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);
  const highlights = mostRead(5, used, l);
  // Blocos por editoria (estilo "últimas de filmes / últimas de séries").
  const byDesk = (c: 'filmes' | 'series') =>
    all.filter((n) => (c === 'filmes' ? n.category === 'filmes' : n.category !== 'filmes') && !feedUsed.includes(n.slug)).slice(0, 5);
  const desks = [
    { title: t.home.deskFilms, href: r.filmes, items: byDesk('filmes') },
    { title: t.home.deskSeries, href: r.series, items: byDesk('series') },
  ].filter((d) => d.items.length);
  // Top 3 do Em alta, sem repetir franquia (ex.: "Cyberpunk: Edgerunners" e "Cyberpunk: Edgerunners 2").
  const top = getTrending(10, l)
    .filter((x, i, arr) => !arr.slice(0, i).some((o) => x.title.name.startsWith(o.title.name) || o.title.name.startsWith(x.title.name)))
    .slice(0, 3);
  const platforms = platformsFor(l, PLATFORMS);
  const heroCategory = categoryLabel(hero.category, l).toUpperCase();

  return (
    <main className="container page">
      <section className="hero">
        <Link href={r.noticia(hero.slug)} className="hero-main">
          <Media src={hero.image.src} alt={hero.image.alt} className="hero-main__img" eager />
          <div className="hero-main__shade" />
          <div className="hero-main__body">
            <div className="hero-main__badges">
              <span className="badge">{hero.featured ? t.home.featured : t.home.latestBadge}</span>
              <span className="badge badge--outline">
                {kicker(hero, l) === heroCategory ? heroCategory : `${heroCategory} · ${kicker(hero, l)}`}
              </span>
            </div>
            <h1 className="display">{hero.title}</h1>
            <p>{hero.dek}</p>
            <div className="hero-main__meta">
              <span className="meta-muted" style={{ fontSize: 12 }}>
                <TimeAgo date={hero.date} l={l} /> · {t.readingTime(readingTime(hero.html))}
              </span>
            </div>
          </div>
        </Link>
        <div className="hero-side">
          {side.map((n) => (
            <SideCard key={n.slug} n={meta(n)} l={l} />
          ))}
        </div>
      </section>

      {trailers.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="display section-title">{t.home.trailers}</h2>
            <Link href={r.trailers} className="see-all">{t.home.seeAll}</Link>
          </div>
          <div className="grid-4 grid-4--trailers">
            {trailers.map((n) => (
              <TrailerCard key={n.slug} n={meta(n)} l={l} />
            ))}
          </div>
        </section>
      )}

      <StreamingTabs
        platforms={platforms}
        news={Object.fromEntries(platforms.map((p) => [p, newsByPlatform(p, l).slice(0, 8).map(meta)]))}
        releases={l === 'pt-br' ? getStreamingReleases() : []}
        buildDate={contentDate()}
        l={l}
      />

      <section className="section with-sidebar">
        <div>
          <h2 className="display section-title" style={{ marginBottom: 8 }}>{t.home.latest}</h2>
          {feed.map((n) => (
            <FeedItem key={n.slug} n={meta(n)} l={l} />
          ))}
          <div className="more-row">
            <Link href={r.filmes} className="btn btn--ghost btn--sm">{t.home.moreFilms}</Link>
            <Link href={r.series} className="btn btn--ghost btn--sm">{t.home.moreSeries}</Link>
          </div>
        </div>
        <aside className="sidebar">
          <Highlights items={highlights.map(meta)} l={l} boxed />
          {top.length > 0 && (
            <div className="promo">
              <span className="display promo__title">{t.home.trendingNow}</span>
              <span className="promo__text">{t.home.trendingText(top.map((x) => x.title.name).join(', '))}</span>
              <Link href={r.emAlta}>{t.home.fullRanking}</Link>
            </div>
          )}
        </aside>
      </section>

      {desks.length > 0 && (
        <section className="section desks">
          {desks.map((d) => (
            <div key={d.title} className="desk">
              <div className="section-head">
                <h2 className="display desk__title">{d.title}</h2>
                <Link href={d.href} className="see-all">{t.home.seeAllF}</Link>
              </div>
              {d.items.map((n) => (
                <ListItem key={n.slug} n={meta(n)} l={l} />
              ))}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
