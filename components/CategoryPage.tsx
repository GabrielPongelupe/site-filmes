import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { Pills } from '@/components/Pills';
import { news, routes, subcats } from '@/lib/data';

export function CategoryPage({ name, lead }: { name: string; lead: string }) {
  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow">CATEGORIA</span>
          <h1 className="display">{name}</h1>
        </div>
        <Pills items={subcats} label="Filtrar categoria" />
      </div>

      <section className="cat-lead">
        <Link href={routes.noticia} className="cat-lead__main">
          <div className="cat-lead__img placeholder">[ destaque da categoria ]</div>
          <span className="kicker">DESTAQUE</span>
          <h2>{lead}</h2>
        </Link>
        <div className="cat-lead__list">
          {news.slice(0, 3).map((n) => (
            <Link key={n.title} href={routes.noticia} className="cat-lead__item">
              <span className="kicker">{n.cat}</span>
              <h3>{n.title}</h3>
              <span className="meta">{n.time}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="ad-row">
        <Ad size="970x90" />
      </div>

      <div className="news-grid">
        {news.map((n) => (
          <Link key={n.title} href={routes.noticia} className="news-card">
            <div className="news-card__img" />
            <span className="kicker">{n.cat}</span>
            <h3>{n.title}</h3>
            <span className="meta">{n.time}</span>
          </Link>
        ))}
      </div>

      <nav className="pagination" aria-label="Paginação">
        <span aria-current="page">1</span>
        <Link href={routes.emBreve}>2</Link>
        <Link href={routes.emBreve}>3</Link>
        <span>…</span>
        <Link href={routes.emBreve}>24</Link>
      </nav>
    </main>
  );
}
