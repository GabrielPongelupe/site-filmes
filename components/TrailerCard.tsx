import Link from 'next/link';
import { routes, trailers } from '@/lib/data';

type Trailer = (typeof trailers)[number];

export function TrailerCard({ t }: { t: Trailer }) {
  return (
    <Link href={routes.emBreve} className="trailer-card">
      <div className="trailer-card__thumb">
        <span className="play" aria-hidden="true">▶</span>
        <span className="duration">{t.dur}</span>
        <span className="views">{t.views} views</span>
      </div>
      <h3>{t.title}</h3>
      <span className="trailer-card__plat">{t.plat}</span>
    </Link>
  );
}
