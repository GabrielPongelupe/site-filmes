import type { Metadata } from 'next';
import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { getAllNews, getTrending, trendingTags } from '@/lib/content';
import { routes } from '@/lib/data';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Em alta' };

function moveClass(move: string) {
  if (move.startsWith('▲') || move === 'NOVO') return 'trend-row__move trend-row__move--up';
  if (move.startsWith('▼')) return 'trend-row__move trend-row__move--down';
  return 'trend-row__move';
}

export default function EmAltaPage() {
  const trending = getTrending(10);
  const latest = getAllNews()[0];

  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow page-head__eyebrow--live">
            ● ATUALIZADO EM {latest ? formatDate(latest.date).toUpperCase() : '—'}
          </span>
          <h1 className="display">Em alta</h1>
        </div>
        <p className="page-head__intro">Os filmes e séries mais citados nas notícias do Spoilado nos últimos 30 dias. A seta compara com os 30 dias anteriores.</p>
      </div>

      <section className="trending-layout">
        {trending.length ? (
          <ol className="trend-list">
            {trending.map((t) => (
              <li key={t.title.slug}>
                <Link href={routes.titulo(t.title.slug)} className="trend-row">
                  <span className={`trend-row__rank ${t.rank <= 3 ? 'trend-row__rank--top' : ''}`}>
                    {String(t.rank).padStart(2, '0')}
                  </span>
                  <Media src={t.image} alt="" className="trend-row__poster" variant="poster" />
                  <div className="trend-row__info">
                    <span className="trend-row__title">{t.title.name}</span>
                    <span className="trend-row__type">
                      {t.title.type === 'serie' ? 'Série' : 'Filme'}
                      {t.title.where[0] ? ` · ${t.title.where[0].name}` : t.title.year ? ` · ${t.title.year}` : ''}
                    </span>
                  </div>
                  <span className={moveClass(t.move)}>{t.move}</span>
                  <span className="trend-row__buzz">{t.count} {t.count === 1 ? 'notícia' : 'notícias'}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">Ainda não há dados suficientes.</p>
        )}
        <aside className="trending-aside">
          <div className="card">
            <h3 className="display">Assuntos do momento</h3>
            <div className="topics">
              {trendingTags(10).map((t) => (
                <Link key={t.slug} href={routes.tag(t.slug)}>#{t.tag}</Link>
              ))}
            </div>
          </div>
          <Ad size="300x600" />
        </aside>
      </section>
    </main>
  );
}
