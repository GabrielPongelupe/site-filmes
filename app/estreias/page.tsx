import type { Metadata } from 'next';
import Link from 'next/link';
import { Pills } from '@/components/Pills';
import { estreias, routes, weeks } from '@/lib/data';

export const metadata: Metadata = { title: 'Estreias da semana' };

export default function EstreiasPage() {
  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow">NOS CINEMAS · QUINTA, 23 OUT</span>
          <h1 className="display">Estreias da semana</h1>
        </div>
        <Pills items={weeks} label="Semana" />
      </div>

      <section className="estreias-grid">
        {estreias.map((e) => (
          <article key={e.title} className="estreia">
            <Link href={routes.titulo} className="estreia__poster placeholder placeholder--poster">
              [ pôster ]
              <span className="rating" style={{ background: e.ratingBg }}>{e.rating}</span>
            </Link>
            <div className="estreia__body">
              <span className="estreia__meta">{e.genre} · {e.dur}</span>
              <h2><Link href={routes.titulo}>{e.title}</Link></h2>
              <p>{e.syn}</p>
              <div className="estreia__actions">
                <Link href={routes.emBreve} className="btn btn--primary btn--sm">▶ Trailer</Link>
                <Link href={routes.emBreve} className="btn btn--ghost btn--sm">Sessões</Link>
                <span className="estreia__dist">{e.dist}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
