'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RegionSwitcher } from '@/components/RegionSwitcher';
import { getDictionary } from '@/lib/dictionaries';
import { paths, type Locale } from '@/lib/i18n';

export function Header({ l }: { l: Locale }) {
  const pathname = usePathname();
  const t = getDictionary(l);
  const r = paths(l);
  const nav = [
    { label: t.nav.home, href: r.home },
    { label: t.nav.filmes, href: r.filmes },
    { label: t.nav.series, href: r.series },
    { label: t.nav.emAlta, href: r.emAlta },
  ];

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href={r.home} className="logo" aria-label={t.header.homeAria}>
          <span className="logo__mark">S</span>
          <span className="logo__name">Spoilado</span>
        </Link>
        <nav className="main-nav" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <form className="search" action={r.busca} role="search">
            <input type="search" name="q" placeholder={t.header.search} aria-label={t.header.searchAria} />
          </form>
          <RegionSwitcher l={l} compact />
          <Link href={r.newsletter} className="newsletter-btn">
            {t.header.newsletter}
          </Link>
        </div>
      </div>
    </header>
  );
}
