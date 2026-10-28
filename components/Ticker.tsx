import Link from 'next/link';
import { getAllNews } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { formatTime } from '@/lib/format';
import { paths, type Locale } from '@/lib/i18n';

export function Ticker({ l }: { l: Locale }) {
  const latest = getAllNews(l).slice(0, 4);
  if (!latest.length) return null;

  return (
    <div className="ticker">
      <div className="container ticker__inner">
        <span className="ticker__label">{getDictionary(l).ticker}</span>
        <div className="ticker__items">
          {latest.map((n) => (
            <Link key={n.slug} href={paths(l).noticia(n.slug)}>
              <span className="ticker__time">{formatTime(n.date, l)}</span>
              {n.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
