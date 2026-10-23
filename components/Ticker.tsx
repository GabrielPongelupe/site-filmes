import Link from 'next/link';
import { getAllNews } from '@/lib/content';
import { routes } from '@/lib/data';
import { formatTime } from '@/lib/format';

export function Ticker() {
  const latest = getAllNews().slice(0, 4);
  if (!latest.length) return null;

  return (
    <div className="ticker">
      <div className="container ticker__inner">
        <span className="ticker__label">AGORA</span>
        <div className="ticker__items">
          {latest.map((n) => (
            <Link key={n.slug} href={routes.noticia(n.slug)}>
              <span className="ticker__time">{formatTime(n.date)}</span>
              {n.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
