import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { FeedItem, Highlights, ListItem, SideCard, TrailerCard } from '@/components/NewsCards';
import { StreamingTabs } from '@/components/StreamingTabs';
import { TimeAgo } from '@/components/TimeAgo';
import { Views } from '@/components/Views';
import {
  CATEGORY_LABEL, PLATFORMS, contentDate, getAllNews, recentNews, getStreamingReleases, getTrending, kicker, meta, mostRead, newsByPlatform,
} from '@/lib/content';
import { routes } from '@/lib/data';
import { readingTime } from '@/lib/format';

export default function Home() {
  const all = getAllNews();
  if (!all.length) {
    return (
      <main className="container page">
        <p className="empty">Nenhuma notícia publicada ainda.</p>
      </main>
    );
  }

  // Home sempre "do dia", como os portais de notícia:
  // manchete = destaque mais recente das últimas 48 h (senão, a notícia mais nova com vídeo ou a mais nova).
  const last48h = recentNews(2);
  const hero = last48h.find((n) => n.featured) ?? last48h.find((n) => n.video) ?? all[0];
  const side = all.filter((n) => n.slug !== hero.slug).slice(0, 3);
  const used = [hero, ...side].map((n) => n.slug);
  // Últimas: o que saiu nos últimos 10 dias, mais nova primeiro.
  const feed = recentNews(10).filter((n) => !used.includes(n.slug)).slice(0, 10);
  const feedUsed = [...used, ...feed.map((n) => n.slug)];
  // Trailers que bombaram: trailers do último mês, ordenados por views.
  const trailers = recentNews(30)
    .filter((n) => n.kind === 'trailer' && !used.includes(n.slug))
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);
  const highlights = mostRead(5, used);
  // Blocos por editoria (estilo "últimas de filmes / últimas de séries").
  const byDesk = (c: 'filmes' | 'series') =>
    all.filter((n) => (c === 'filmes' ? n.category === 'filmes' : n.category !== 'filmes') && !feedUsed.includes(n.slug)).slice(0, 5);
  const desks = [
    { title: 'Últimas de filmes', href: routes.filmes, items: byDesk('filmes') },
    { title: 'Últimas de séries e streaming', href: routes.series, items: byDesk('series') },
  ].filter((d) => d.items.length);
  // Top 3 do Em alta, sem repetir franquia (ex.: "Cyberpunk: Edgerunners" e "Cyberpunk: Edgerunners 2").
  const top = getTrending(10)
    .filter((t, i, arr) => !arr.slice(0, i).some((o) => t.title.name.startsWith(o.title.name) || o.title.name.startsWith(t.title.name)))
    .slice(0, 3);

  return (
    <main className="container page">
      <section className="hero">
        <Link href={routes.noticia(hero.slug)} className="hero-main">
          <Media src={hero.image.src} alt={hero.image.alt} className="hero-main__img" eager />
          <div className="hero-main__shade" />
          <div className="hero-main__body">
            <div className="hero-main__badges">
              <span className="badge">{hero.featured ? 'DESTAQUE' : 'ÚLTIMA'}</span>
              <span className="badge badge--outline">{kicker(hero) === CATEGORY_LABEL[hero.category].toUpperCase() ? kicker(hero) : `${CATEGORY_LABEL[hero.category].toUpperCase()} · ${kicker(hero)}`}</span>
            </div>
            <h1 className="display">{hero.title}</h1>
            <p>{hero.dek}</p>
            <div className="hero-main__meta">
              <Views n={hero.views} overlay />
              <span className="meta-muted" style={{ fontSize: 12 }}>
                <TimeAgo date={hero.date} /> · {readingTime(hero.html)} min de leitura
              </span>
            </div>
          </div>
        </Link>
        <div className="hero-side">
          {side.map((n) => (
            <SideCard key={n.slug} n={meta(n)} />
          ))}
        </div>
      </section>

      {trailers.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="display section-title">Trailers que bombaram</h2>
            <Link href={routes.trailers} className="see-all">Ver todos →</Link>
          </div>
          <div className="grid-4 grid-4--trailers">
            {trailers.map((n) => (
              <TrailerCard key={n.slug} n={meta(n)} />
            ))}
          </div>
        </section>
      )}

      <StreamingTabs
        platforms={PLATFORMS}
        news={Object.fromEntries(PLATFORMS.map((p) => [p, newsByPlatform(p).slice(0, 8).map(meta)]))}
        releases={getStreamingReleases()}
        buildDate={contentDate()}
      />

      <section className="section with-sidebar">
        <div>
          <h2 className="display section-title" style={{ marginBottom: 8 }}>Últimas</h2>
          {feed.map((n) => (
            <FeedItem key={n.slug} n={meta(n)} />
          ))}
          <div className="more-row">
            <Link href={routes.filmes} className="btn btn--ghost btn--sm">Mais de Filmes</Link>
            <Link href={routes.series} className="btn btn--ghost btn--sm">Mais de Séries</Link>
          </div>
        </div>
        <aside className="sidebar">
          <Highlights items={highlights.map(meta)} boxed />
          <Ad size="300x250" />
          {top.length > 0 && (
            <div className="promo">
              <span className="display promo__title">Em alta agora</span>
              <span className="promo__text">{top.map((t) => t.title.name).join(', ')} lideram as conversas no Spoilado.</span>
              <Link href={routes.emAlta}>Ver ranking completo →</Link>
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
                <Link href={d.href} className="see-all">Ver todas →</Link>
              </div>
              {d.items.map((n) => (
                <ListItem key={n.slug} n={meta(n)} />
              ))}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
