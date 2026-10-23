import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ad } from '@/components/Ad';
import { Media } from '@/components/Media';
import { Highlights, RelatedItem } from '@/components/NewsCards';
import { ShareButtons } from '@/components/ShareButtons';
import { ViewCount } from '@/components/ViewCount';
import { YouTube } from '@/components/YouTube';
import {
  CATEGORY_LABEL, getAllNews, mostRead, getNews, getTitle, kicker, meta, relatedNews, slugify, titleImage,
} from '@/lib/content';
import { routes } from '@/lib/data';
import { formatDateTime, readingTime } from '@/lib/format';


// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<'/noticia/[slug]'>): Promise<Metadata> {
  const n = getNews((await params).slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.dek,
    openGraph: { title: n.title, description: n.dek, images: [n.image.src], type: 'article', publishedTime: n.date },
  };
}

const CATEGORY_ROUTE = { filmes: routes.filmes, series: routes.series, streaming: routes.series };

export default async function NoticiaPage({ params }: PageProps<'/noticia/[slug]'>) {
  const n = getNews((await params).slug);
  if (!n) notFound();

  const mainTitle = n.titles[0] ? getTitle(n.titles[0].slug) : undefined;
  const related = relatedNews(n, 4);
  const crumb = n.titles[0]?.name ?? kicker(n);

  return (
    <main className="container article-layout">
      <article className="article">
        <nav className="breadcrumb" aria-label="Você está em">
          <Link href={routes.home}>Home</Link>
          <span>/</span>
          <Link href={CATEGORY_ROUTE[n.category]}>{CATEGORY_LABEL[n.category]}</Link>
          <span>/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <span className="article__kicker">
          {CATEGORY_LABEL[n.category].toUpperCase()}
          {n.kind !== 'noticia' ? ` · ${kicker(n)}` : ''}
          {n.featured ? ' · DESTAQUE' : ''}
        </span>
        <h1>{n.title}</h1>
        <p className="article__dek">{n.dek}</p>

        <div className="byline">
          <div className="byline__author">
            <div className="avatar avatar--brand">S</div>
            <div className="byline__name">
              <strong>Por Redação Spoilado</strong>
              <span className="meta-muted">
                {formatDateTime(n.date)} · {readingTime(n.html)} min de leitura
              </span>
            </div>
          </div>
          <div className="byline__actions">
            <ViewCount views={n.views} />
            <ShareButtons />
          </div>
        </div>

        {n.kind === 'trailer' && n.video ? (
          <figure className="article__figure">
            <YouTube id={n.video.youtube} title={n.video.title} size="lg" />
            <figcaption className="article__caption">{n.video.title ?? 'Vídeo'} · YouTube</figcaption>
          </figure>
        ) : (
          <figure className="article__figure">
            <Media src={n.image.src} alt={n.image.alt} className="article__img" eager />
            <figcaption className="article__caption">
              {n.image.alt}
              {n.image.credit ? `. Imagem: ${n.image.credit}` : ''}
            </figcaption>
          </figure>
        )}

        <div className="article__body" dangerouslySetInnerHTML={{ __html: n.html }} />

        {n.video && n.kind !== 'trailer' && (
          <div style={{ marginTop: 22 }}>
            <YouTube id={n.video.youtube} title={n.video.title} />
          </div>
        )}

        {n.sources.length > 0 && (
          <div className="sources">
            <span className="sources__label">FONTES</span>
            <ul>
              {n.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mainTitle && (
          <Link href={routes.titulo(mainTitle.slug)} className="title-box">
            <Media src={titleImage(mainTitle)} alt="" className="title-box__poster" variant="poster" />
            <div className="title-box__info">
              <span className="meta-muted">
                {[mainTitle.type === 'serie' ? 'SÉRIE' : 'FILME', mainTitle.year, mainTitle.genres[0]?.toUpperCase()].filter(Boolean).join(' · ')}
              </span>
              <span className="title-box__name">{mainTitle.name}</span>
              {mainTitle.where[0] && <span className="title-box__where">Onde assistir: {mainTitle.where.map((w) => w.name).join(', ')}</span>}
            </div>
            <span className="title-box__cta">{mainTitle.hasProfile ? 'Ficha completa →' : 'Tudo sobre →'}</span>
          </Link>
        )}

        <div className="tags">
          {n.tags.map((t) => (
            <Link key={t} href={routes.tag(slugify(t))} className="tag">#{t}</Link>
          ))}
        </div>

        {related.length > 0 && (
          <section className="article-related">
            <h2 className="display">Leia também</h2>
            {related.map((r) => (
              <RelatedItem key={r.slug} n={meta(r)} />
            ))}
          </section>
        )}
      </article>

      <aside className="article-aside">
        <Ad size="300x250" />
        <Highlights items={mostRead(5, [n.slug]).map(meta)} />
        <Ad size="300x600" className="sticky-ad" />
      </aside>
    </main>
  );
}
