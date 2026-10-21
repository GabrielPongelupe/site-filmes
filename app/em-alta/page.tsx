import type { Metadata } from 'next';
import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { routes, topics, trending } from '@/lib/data';

export const metadata: Metadata = { title: 'Em alta' };

function moveClass(move: string) {
  if (move.startsWith('▲') || move === 'NOVO') return 'trend-row__move trend-row__move--up';
  if (move.startsWith('▼')) return 'trend-row__move trend-row__move--down';
  return 'trend-row__move';
}

export default function EmAltaPage() {
  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow page-head__eyebrow--live">● ATUALIZADO HÁ 5 MIN</span>
          <h1 className="display">Em alta</h1>
        </div>
        <p className="page-head__intro">Os filmes e séries mais buscados e comentados no Spoilado nas últimas 24 horas.</p>
      </div>

      <section className="trending-layout">
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {trending.map((t, i) => (
            <li key={t.title}>
              <Link href={routes.titulo} className="trend-row">
                <span className={`trend-row__rank ${i < 3 ? 'trend-row__rank--top' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="trend-row__poster" />
                <div className="trend-row__info">
                  <span className="trend-row__title">{t.title}</span>
                  <span className="trend-row__type">{t.type}</span>
                </div>
                <span className={moveClass(t.move)}>{t.move}</span>
                <span className="trend-row__buzz">{t.buzz} buscas</span>
              </Link>
            </li>
          ))}
        </ol>
        <aside className="trending-aside">
          <div className="card">
            <h3 className="display">Assuntos do momento</h3>
            <div className="topics">
              {topics.map((t) => (
                <Link key={t} href={routes.emBreve}>#{t}</Link>
              ))}
            </div>
          </div>
          <Ad size="300x600" />
        </aside>
      </section>
    </main>
  );
}
