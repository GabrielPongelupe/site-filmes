import Link from 'next/link';
import { footerCols } from '@/lib/data';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="display">Spoilado</span>
          <p>Notícias, trailers e estreias de cinema e streaming, todo dia.</p>
        </div>
        {footerCols.map((c) => (
          <div key={c.h} className="site-footer__col">
            <h4>{c.h}</h4>
            {c.l.map(([label, href]) => (
              <Link key={label} href={href}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container site-footer__legal">© 2026 Spoilado</div>
    </footer>
  );
}
