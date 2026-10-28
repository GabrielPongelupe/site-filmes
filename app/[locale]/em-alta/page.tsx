import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { getAllNews, getTrending, trendingTags } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/format';
import { isLocale, paths } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/em-alta'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).trending.title } : {};
}

function moveClass(move: string) {
  if (move.startsWith('▲') || move === 'NEW') return 'trend-row__move trend-row__move--up';
  if (move.startsWith('▼')) return 'trend-row__move trend-row__move--down';
  return 'trend-row__move';
}

export default async function EmAltaPage({ params }: PageProps<'/[locale]/em-alta'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const d = getDictionary(l);
  const r = paths(l);
  const trending = getTrending(10, l);
  const latest = getAllNews(l)[0];

  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow page-head__eyebrow--live">
            {d.trending.updated(latest ? formatDate(latest.date, l).toUpperCase() : '—')}
          </span>
          <h1 className="display">{d.trending.title}</h1>
        </div>
        <p className="page-head__intro">{d.trending.intro}</p>
      </div>

      <section className="trending-layout">
        {trending.length ? (
          <ol className="trend-list">
            {trending.map((t) => (
              <li key={t.title.slug}>
                <Link href={r.titulo(t.title.slug)} className="trend-row">
                  <span className={`trend-row__rank ${t.rank <= 3 ? 'trend-row__rank--top' : ''}`}>
                    {String(t.rank).padStart(2, '0')}
                  </span>
                  <Media src={t.image} alt="" className="trend-row__poster" variant="poster" />
                  <div className="trend-row__info">
                    <span className="trend-row__title">{t.title.name}</span>
                    <span className="trend-row__type">
                      {d.type[t.title.type]}
                      {t.title.where[0] ? ` · ${t.title.where[0].name}` : t.title.year ? ` · ${t.title.year}` : ''}
                    </span>
                  </div>
                  <span className={moveClass(t.move)}>{t.move === 'NEW' ? d.trending.new : t.move}</span>
                  <span className="trend-row__buzz">{d.trending.news(t.count)}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">{d.trending.empty}</p>
        )}
        <aside className="trending-aside">
          <div className="card">
            <h3 className="display">{d.trending.topics}</h3>
            <div className="topics">
              {trendingTags(10).map((t) => (
                <Link key={t.slug} href={r.tag(t.slug)}>#{t.tag}</Link>
              ))}
            </div>
          </div>
          <Ad size="300x600" l={l} />
        </aside>
      </section>
    </main>
  );
}
