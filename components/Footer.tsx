import Link from 'next/link';
import { RegionSwitcher } from '@/components/RegionSwitcher';
import { getDictionary } from '@/lib/dictionaries';
import { paths, type Locale } from '@/lib/i18n';

export function Footer({ l }: { l: Locale }) {
  const t = getDictionary(l).footer;
  const r = paths(l);
  const cols = [
    { h: t.sections, l: [[t.links.filmes, r.filmes], [t.links.series, r.series], [t.links.criticas, r.criticas]] },
    { h: t.guides, l: [[t.links.emAlta, r.emAlta], [t.links.trailers, r.trailers], [t.links.bilheteria, r.bilheteria]] },
    { h: t.about, l: [[t.links.sobre, r.sobre], [t.links.contato, r.emBreve], [t.links.privacidade, r.privacidade]] },
  ];

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="display">Spoilado</span>
          <p>{t.tagline}</p>
          <RegionSwitcher l={l} className="region--footer" />
        </div>
        {cols.map((c) => (
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
