import Link from 'next/link';
import { Media } from '@/components/Media';
import { TimeAgo } from '@/components/TimeAgo';
import { kicker, type NewsMeta } from '@/lib/content-shared';
import { getDictionary } from '@/lib/dictionaries';
import { paths, type Locale } from '@/lib/i18n';

type P = { n: NewsMeta; l: Locale };

export function SideCard({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="side-card">
      <Media src={n.image.src} alt={n.image.alt} variant="thumb" className="side-card__img">
      </Media>
      <div className="side-card__body">
        <span className="kicker">{kicker(n, l)}</span>
        <h3>{n.title}</h3>
        <span className="meta-muted">
          <TimeAgo date={n.date} l={l} />
        </span>
      </div>
    </Link>
  );
}

export function FeedItem({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="feed-item">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="feed-item__img">
      </Media>
      <div className="feed-item__body">
        <span className="kicker">{kicker(n, l)}</span>
        <h3>{n.title}</h3>
        <p>{n.dek}</p>
        <span className="meta">
          <TimeAgo date={n.date} l={l} />
        </span>
      </div>
    </Link>
  );
}

export function NewsCard({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="news-card">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="news-card__img">
      </Media>
      <span className="kicker">{kicker(n, l)}</span>
      <h3>{n.title}</h3>
      <span className="meta">
        <TimeAgo date={n.date} l={l} />
      </span>
    </Link>
  );
}

export function ListItem({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="cat-lead__item">
      <span className="kicker">{kicker(n, l)}</span>
      <h3>{n.title}</h3>
      <span className="meta">
        <TimeAgo date={n.date} l={l} />
      </span>
    </Link>
  );
}

export function RelatedItem({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="related-item">
      <Media src={n.image.src} alt={n.image.alt} variant="sm" className="related-item__img">
      </Media>
      <div className="related-item__body">
        <span className="kicker">{kicker(n, l)}</span>
        <span className="related-item__title">{n.title}</span>
        <span className="meta">
          <TimeAgo date={n.date} l={l} />
        </span>
      </div>
    </Link>
  );
}

export function TrailerCard({ n, l }: P) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="trailer-card">
      <Media
        src={n.video ? `https://i.ytimg.com/vi/${n.video.youtube}/hqdefault.jpg` : n.image.src}
        alt={n.image.alt}
        variant="sm"
        className="trailer-card__thumb"
      >
        <span className="play" aria-hidden="true">▶</span>
        <span className="duration">{getDictionary(l).kicker.trailer}</span>
      </Media>
      <h3>{n.title}</h3>
      <TimeAgo date={n.date} l={l} className="trailer-card__plat" />
    </Link>
  );
}

/** Lista numerada da lateral ("Mais lidas"). */
export function Highlights({ items, l, boxed = false }: { items: NewsMeta[]; l: Locale; boxed?: boolean }) {
  return (
    <div className={`most-read ${boxed ? 'card' : ''}`}>
      <h3 className="display">{getDictionary(l).mostRead}</h3>
      {items.map((n, i) => (
        <Link key={n.slug} href={paths(l).noticia(n.slug)} className="most-read__item">
          <span className="most-read__n">{i + 1}</span>
          <span className="most-read__title">
            {n.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
