import Link from 'next/link';
import { routes, ticker } from '@/lib/data';

export function Ticker() {
  return (
    <div className="ticker">
      <div className="container ticker__inner">
        <span className="ticker__label">AGORA</span>
        <div className="ticker__items">
          {ticker.map((t) => (
            <Link key={t.time} href={routes.noticia}>
              <span className="ticker__time">{t.time}</span>
              {t.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
