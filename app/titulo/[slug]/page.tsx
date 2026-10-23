import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { RelatedItem } from '@/components/NewsCards';
import { WatchlistButton } from '@/components/WatchlistButton';
import { YouTube } from '@/components/YouTube';
import { getAllTitles, getTitle, getTrending, meta, newsByTitle } from '@/lib/content';
import { routes } from '@/lib/data';
import { formatDate } from '@/lib/format';


// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return [...getAllTitles().keys()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/titulo/[slug]'>): Promise<Metadata> {
  const t = getTitle((await params).slug);
  if (!t) return {};
  return { title: t.name, description: `${t.type === 'serie' ? 'Série' : 'Filme'} ${t.name}: notícias, trailer, elenco e onde assistir.` };
}

export default async function TituloPage({ params }: PageProps<'/titulo/[slug]'>) {
  const t = getTitle((await params).slug);
  if (!t) notFound();

  const news = newsByTitle(t.slug);
  const review = news.find((n) => n.kind === 'critica');
  const trailerId = t.trailer ?? news.find((n) => n.video)?.video?.youtube;
  const trend = getTrending(10).find((x) => x.title.slug === t.slug);
  const backdrop = t.backdrop ?? news[0]?.image.src;

  const metaLine = [
    t.type === 'serie' ? 'SÉRIE' : 'FILME',
    t.year && (t.type === 'serie' ? `${t.year}–` : t.year),
    t.seasons && `${t.seasons} TEMPORADA${t.seasons > 1 ? 'S' : ''}`,
    t.runtime,
    t.rating && (t.rating === 'L' ? 'LIVRE' : `${t.rating} ANOS`),
  ].filter(Boolean).join(' · ');

  const scores = [
    trend && { v: `#${trend.rank}`, l: 'Em alta no Spoilado', accent: true },
    { v: String(news.length), l: news.length === 1 ? 'Notícia' : 'Notícias', accent: !trend },
    t.release && { v: formatDate(`${t.release}T12:00:00-03:00`).replace(/ \d{4}$/, ''), l: `Estreia no Brasil · ${t.release.slice(0, 4)}`, accent: false },
  ].filter(Boolean) as { v: string; l: string; accent: boolean }[];

  const ficha = [
    t.originalName && t.originalName !== t.name && { k: 'Título original', v: t.originalName },
    ...t.credits,
    t.release && { k: 'Estreia no Brasil', v: formatDate(`${t.release}T12:00:00-03:00`) },
    t.rating && { k: 'Classificação', v: t.rating === 'L' ? 'Livre' : `${t.rating} anos` },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <main>
      <section className="title-hero">
        <Media src={backdrop} alt="" className="title-hero__backdrop" eager />
        <div className="title-hero__shade" />
        <div className={`container title-hero__inner ${t.poster ? '' : 'title-hero__inner--no-poster'}`}>
          {t.poster && <Media src={t.poster} alt={`Pôster de ${t.name}`} className="title-hero__poster" eager />}
          <div className="title-hero__info">
            <span className="meta-muted" style={{ fontSize: 12 }}>{metaLine}</span>
            <h1 className="display">{t.name}</h1>
            {t.genres.length > 0 && (
              <div className="pills">
                {t.genres.map((g) => (
                  <span key={g} className="genre-pill">{g}</span>
                ))}
              </div>
            )}
            {t.synopsisHtml ? (
              <div className="title-hero__syn" dangerouslySetInnerHTML={{ __html: t.synopsisHtml }} />
            ) : (
              news[0] && <p className="title-hero__syn">{news[0].dek}</p>
            )}
            <div className="scores">
              {scores.map((s) => (
                <div key={s.l} className="score">
                  <span className="score__v" style={{ color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.v}</span>
                  <span className="score__l">{s.l}</span>
                </div>
              ))}
            </div>
            <div className="title-hero__ctas">
              {trailerId && <a href="#trailer" className="btn btn--primary">▶ Ver trailer</a>}
              <WatchlistButton slug={t.slug} />
            </div>
          </div>
        </div>
      </section>

      <div className="container title-body">
        <div className="title-body__main">
          {trailerId && (
            <section id="trailer" style={{ scrollMarginTop: 90 }}>
              <h2 className="display">Trailer</h2>
              <YouTube id={trailerId} title={`${t.name} · trailer`} size="lg" />
            </section>
          )}

          {t.cast.length > 0 && (
            <section>
              <h2 className="display">Elenco</h2>
              <div className="cast">
                {t.cast.slice(0, 6).map((c) => (
                  <div key={c.name} className="cast__item">
                    <div className="cast__photo" aria-hidden="true">
                      {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <span className="cast__name">{c.name}</span>
                    {c.role && <span className="cast__role">{c.role}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {review && (
            <section>
              <h2 className="display">O que a crítica diz</h2>
              <div className="review">
                <div className="review__score">
                  <strong>✦</strong>
                  <span>repercussão</span>
                </div>
                <div className="review__text">
                  <span className="review__head">{review.title}</span>
                  <p>{review.dek}</p>
                  <Link href={routes.noticia(review.slug)}>Ler texto completo →</Link>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="display" style={{ marginBottom: 6 }}>Notícias de {t.name}</h2>
            {news.map((n) => (
              <RelatedItem key={n.slug} n={meta(n)} />
            ))}
          </section>
        </div>

        <aside className="title-aside">
          {t.where.length > 0 && (
            <div className="card where-card">
              <h3 className="display">Onde assistir</h3>
              {t.where.map((w) => (
                <div key={w.name} className="where-row">
                  <strong>{w.name}</strong>
                  <span>{w.kind}</span>
                </div>
              ))}
            </div>
          )}
          {ficha.length > 0 && (
            <div className="card ficha">
              <h3 className="display">Ficha</h3>
              <dl>
                {ficha.map((f) => (
                  <div key={f.k} className="ficha__row">
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Ad size="300x250" />
          <Link href={routes.emAlta} className="see-all">Ver o que está em alta →</Link>
        </aside>
      </div>
    </main>
  );
}
