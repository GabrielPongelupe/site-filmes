import Link from 'next/link';
import { Media } from '@/components/Media';
import { TimeAgo } from '@/components/TimeAgo';
import { Views } from '@/components/Views';
import { kicker, type NewsMeta } from '@/lib/content-shared';
import { routes } from '@/lib/data';

type P = { n: NewsMeta };

export function SideCard({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="side-card">
      <Media src={n.image.src} alt={n.image.alt} variant="thumb" className="side-card__img">
        <Views n={n.views} overlay />
      </Media>
      <div className="side-card__body">
        <span className="kicker">{kicker(n)}</span>
        <h3>{n.title}</h3>
        <span className="meta-muted">
          <TimeAgo date={n.date} />
        </span>
      </div>
    </Link>
  );
}

export function FeedItem({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="feed-item">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="feed-item__img">
        <Views n={n.views} overlay />
      </Media>
      <div className="feed-item__body">
        <span className="kicker">{kicker(n)}</span>
        <h3>{n.title}</h3>
        <p>{n.dek}</p>
        <span className="meta">
          <TimeAgo date={n.date} />
        </span>
      </div>
    </Link>
  );
}

export function NewsCard({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="news-card">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="news-card__img">
        <Views n={n.views} overlay />
      </Media>
      <span className="kicker">{kicker(n)}</span>
      <h3>{n.title}</h3>
      <span className="meta">
        <TimeAgo date={n.date} />
      </span>
    </Link>
  );
}

export function ListItem({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="cat-lead__item">
      <span className="kicker">{kicker(n)}</span>
      <h3>{n.title}</h3>
      <span className="meta">
        <TimeAgo date={n.date} />
      </span>
    </Link>
  );
}

export function RelatedItem({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="related-item">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="related-item__img">
        <Views n={n.views} overlay />
      </Media>
      <div className="related-item__body">
        <span className="kicker">{kicker(n)}</span>
        <span className="related-item__title">{n.title}</span>
        <span className="meta">
          <TimeAgo date={n.date} />
        </span>
      </div>
    </Link>
  );
}

export function TrailerCard({ n }: P) {
  return (
    <Link href={routes.noticia(n.slug)} className="trailer-card">
      <Media
        src={n.video ? `https://i.ytimg.com/vi/${n.video.youtube}/hqdefault.jpg` : n.image.src}
        alt={n.image.alt}
        variant="sm"
        className="trailer-card__thumb"
      >
        <span className="play" aria-hidden="true">▶</span>
        <span className="duration">TRAILER</span>
        <Views n={n.views} overlay />
      </Media>
      <h3>{n.title}</h3>
      <TimeAgo date={n.date} className="trailer-card__plat" />
    </Link>
  );
}

/** Lista numerada da lateral ("Mais lidas"). */
export function Highlights({ items, boxed = false }: { items: NewsMeta[]; boxed?: boolean }) {
  return (
    <div className={`most-read ${boxed ? 'card' : ''}`}>
      <h3 className="display">Mais lidas</h3>
      {items.map((n, i) => (
        <Link key={n.slug} href={routes.noticia(n.slug)} className="most-read__item">
          <span className="most-read__n">{i + 1}</span>
          <span className="most-read__title">
            {n.title}
            <Views n={n.views} />
          </span>
        </Link>
      ))}
    </div>
  );
}
