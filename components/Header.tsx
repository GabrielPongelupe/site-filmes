'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, routes } from '@/lib/data';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href={routes.home} className="logo" aria-label="Spoilado — página inicial">
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
          <form className="search" action={routes.busca} role="search">
            <input type="search" name="q" placeholder="Buscar filme, série, ator…" aria-label="Buscar" />
          </form>
          <Link href={routes.emBreve} className="newsletter-btn">
            Newsletter
          </Link>
        </div>
      </div>
    </header>
  );
}
