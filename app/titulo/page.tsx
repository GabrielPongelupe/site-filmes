import type { Metadata } from 'next';
import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { routes, title } from '@/lib/data';

// Página genérica de filme/série: todos os títulos do site apontam para cá
// até existir conteúdo real.
export const metadata: Metadata = { title: title.name };

export default function TituloPage() {
  return (
    <main>
      <section className="title-hero">
        <span className="title-hero__label">[ backdrop · still panorâmico ]</span>
        <div className="title-hero__shade" />
        <div className="container title-hero__inner">
          <div className="title-hero__poster placeholder">[ pôster ]</div>
          <div className="title-hero__info">
            <span className="meta-muted" style={{ fontSize: 12 }}>{title.meta}</span>
            <h1 className="display">{title.name}</h1>
            <div className="pills">
              {title.genres.map((g) => (
                <span key={g} className="genre-pill">{g}</span>
              ))}
            </div>
            <p className="title-hero__syn">{title.synopsis}</p>
            <div className="scores">
              {title.scores.map((s) => (
                <div key={s.l} className="score">
                  <span className="score__v" style={{ color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.v}</span>
                  <span className="score__l">{s.l}</span>
                </div>
              ))}
            </div>
            <div className="title-hero__ctas">
              <Link href={routes.emBreve} className="btn btn--primary">▶ Ver trailer</Link>
              <Link href={routes.emBreve} className="btn">+ Quero assistir</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container title-body">
        <div className="title-body__main">
          <section>
            <h2 className="display">Elenco</h2>
            <div className="cast">
              {title.cast.map((c) => (
                <div key={c.n} className="cast__item">
                  <div className="cast__photo" />
                  <span className="cast__name">{c.n}</span>
                  <span className="cast__role">{c.r}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="display">Crítica Spoilado</h2>
            <div className="review">
              <div className="review__score">
                <strong>{title.review.score}</strong>
                <span>de 10</span>
              </div>
              <div className="review__text">
                <span className="review__head">{title.review.head}</span>
                <p>{title.review.text}</p>
                <Link href={routes.noticia}>Ler crítica completa →</Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="display" style={{ marginBottom: 6 }}>Notícias de {title.name}</h2>
            {title.related.map((n) => (
              <Link key={n.title} href={routes.noticia} className="related-item">
                <div className="related-item__img" />
                <div className="related-item__body">
                  <span className="related-item__title">{n.title}</span>
                  <span className="meta">{n.time}</span>
                </div>
              </Link>
            ))}
          </section>
        </div>

        <aside className="title-aside">
          <div className="card where-card">
            <h3 className="display">Onde assistir</h3>
            {title.providers.map((p) => (
              <Link key={p.name} href={routes.emBreve} className="where-row">
                <strong>{p.name}</strong>
                <span>{p.kind}</span>
              </Link>
            ))}
          </div>
          <div className="card ficha">
            <h3 className="display">Ficha</h3>
            <dl>
              {title.ficha.map((f) => (
                <div key={f.k} className="ficha__row">
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Ad size="300x250" />
        </aside>
      </div>
    </main>
  );
}
