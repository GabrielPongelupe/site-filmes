import type { Metadata } from 'next';
import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { MostRead } from '@/components/MostRead';
import { article, routes, share, title } from '@/lib/data';

// Página genérica de notícia: todas as notícias do site apontam para cá
// até existir conteúdo real.
export const metadata: Metadata = { title: article.title };

export default function NoticiaPage() {
  return (
    <main className="container article-layout">
      <article className="article">
        <nav className="breadcrumb" aria-label="Você está em">
          <Link href={routes.home}>Home</Link>
          <span>/</span>
          <Link href={article.section.href}>{article.section.label}</Link>
          <span>/</span>
          <span aria-current="page">{article.crumb}</span>
        </nav>
        <span className="article__kicker">{article.kicker}</span>
        <h1>{article.title}</h1>
        <p className="article__dek">{article.dek}</p>

        <div className="byline">
          <div className="byline__author">
            <div className="avatar" />
            <div className="byline__name">
              <strong>Por {article.author}</strong>
              <span className="meta-muted">{article.date}</span>
            </div>
          </div>
          <div className="share">
            {share.map((s) => (
              <button key={s} type="button">{s}</button>
            ))}
          </div>
        </div>

        <figure className="article__figure">
          <div className="article__img placeholder">[ imagem principal · 16:9 ]</div>
          <figcaption className="article__caption">{article.caption}</figcaption>
        </figure>

        <div className="article__body">
          <p>A espera acabou, ou quase. A segunda temporada de Órbita Zero estreia em 12 de março, com episódios semanais. O anúncio veio junto de um trailer de dois minutos que já passou de 4 milhões de visualizações em menos de seis horas.</p>
          <p>A prévia retoma a história logo após o final da primeira temporada, com a tripulação da estação Kepler isolada e sem contato com a Terra. O que chamou atenção dos fãs foi o plano final, que mostra um personagem dado como morto.</p>
          <blockquote>“A segunda temporada é sobre o que acontece quando ninguém está vindo te salvar.”</blockquote>
          <p>A showrunner confirmou que a nova leva terá oito episódios e que parte das gravações aconteceu em locações reais no deserto do Atacama.</p>
          <div className="embed">
            <span className="play play--md" aria-hidden="true">▶</span>
            <span className="embed__label">[ trailer incorporado ]</span>
          </div>
          <p>Os episódios da primeira temporada seguem disponíveis no catálogo, e uma maratona com comentários do elenco foi anunciada para a semana anterior à estreia.</p>
        </div>

        <Link href={routes.titulo} className="title-box">
          <div className="title-box__poster" />
          <div className="title-box__info">
            <span className="meta-muted">{title.boxMeta}</span>
            <span className="title-box__name">{title.name}</span>
            <span className="title-box__where">Onde assistir: {title.where}</span>
          </div>
          <span className="title-box__cta">Ficha completa →</span>
        </Link>

        <div className="tags">
          {article.tags.map((t) => (
            <Link key={t} href={routes.emBreve} className="tag">#{t}</Link>
          ))}
        </div>
      </article>

      <aside className="article-aside">
        <Ad size="300x250" />
        <MostRead />
        <Ad size="300x600" className="sticky-ad" />
      </aside>
    </main>
  );
}
