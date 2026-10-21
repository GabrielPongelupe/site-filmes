import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { MostRead } from '@/components/MostRead';
import { StreamingTabs } from '@/components/StreamingTabs';
import { TrailerCard } from '@/components/TrailerCard';
import { leadStory, news, routes, trailers } from '@/lib/data';

export default function Home() {
  return (
    <main className="container page">
      <section className="hero">
        <Link href={routes.noticia} className="hero-main">
          <span className="hero-main__label">[ still da série · 16:9 ]</span>
          <div className="hero-main__shade" />
          <div className="hero-main__body">
            <div className="hero-main__badges">
              <span className="badge">EXCLUSIVO</span>
              <span className="badge badge--outline">SÉRIES</span>
            </div>
            <h1 className="display">{leadStory.title}</h1>
            <p>{leadStory.dek}</p>
            <span className="meta-muted" style={{ fontSize: 12 }}>{leadStory.meta}</span>
          </div>
        </Link>
        <div className="hero-side">
          {news.slice(0, 3).map((n) => (
            <Link key={n.title} href={routes.noticia} className="side-card">
              <div className="side-card__img placeholder placeholder--thumb">{n.img}</div>
              <div className="side-card__body">
                <span className="kicker">{n.cat}</span>
                <h3>{n.title}</h3>
                <span className="meta-muted">{n.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display section-title">Trailers que bombaram</h2>
          <Link href={routes.emBreve} className="see-all">Ver todos →</Link>
        </div>
        <div className="grid-4 grid-4--trailers">
          {trailers.map((t) => (
            <TrailerCard key={t.title} t={t} />
          ))}
        </div>
      </section>

      <StreamingTabs />

      <section className="section with-sidebar">
        <div>
          <h2 className="display section-title" style={{ marginBottom: 8 }}>Últimas</h2>
          {news.slice(1, 7).map((n) => (
            <Link key={n.title} href={routes.noticia} className="feed-item">
              <div className="feed-item__img placeholder placeholder--sm">{n.img}</div>
              <div className="feed-item__body">
                <span className="kicker">{n.cat}</span>
                <h3>{n.title}</h3>
                <p>{n.dek}</p>
                <span className="meta">{n.time}</span>
              </div>
            </Link>
          ))}
        </div>
        <aside className="sidebar">
          <MostRead boxed />
          <Ad size="300x250" />
          <div className="promo">
            <span className="display promo__title">Estreias da semana</span>
            <span className="promo__text">7 filmes chegam aos cinemas nesta quinta.</span>
            <Link href={routes.estreias}>Ver lista completa →</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
