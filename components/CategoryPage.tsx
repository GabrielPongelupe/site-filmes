import Link from 'next/link';
import { Ad } from '@/components/Ad';
import { CategoryFeed } from '@/components/CategoryFeed';
import { Media } from '@/components/Media';
import { ListItem } from '@/components/NewsCards';
import { meta, type News } from '@/lib/content';
import { routes } from '@/lib/data';

type Props = {
  eyebrow: string;
  name: string;
  items: News[];
  intro?: string;
  filters?: boolean;
};

// Página de listagem (categorias, tags, críticas, bilheteria…): destaque + 3 manchetes + grade paginada.
export function CategoryPage({ eyebrow, name, items, intro, filters = true }: Props) {
  const lead = items.find((n) => n.featured) ?? items[0];
  const side = items.filter((n) => n !== lead).slice(0, 3);
  const rest = items.filter((n) => n !== lead && !side.includes(n));

  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow">{eyebrow}</span>
          <h1 className="display">{name}</h1>
        </div>
        {intro && <p className="page-head__intro">{intro}</p>}
      </div>

      {lead ? (
        <>
          <section className="cat-lead">
            <Link href={routes.noticia(lead.slug)} className="cat-lead__main">
              <Media src={lead.image.src} alt={lead.image.alt} className="cat-lead__img" eager />
              <span className="kicker">DESTAQUE</span>
              <h2>{lead.title}</h2>
            </Link>
            <div className="cat-lead__list">
              {side.map((n) => (
                <ListItem key={n.slug} n={meta(n)} />
              ))}
            </div>
          </section>

          {rest.length > 0 && (
            <>
              <div className="ad-row">
                <Ad size="970x90" />
              </div>
              <CategoryFeed items={rest.map(meta)} filters={filters} />
            </>
          )}
        </>
      ) : (
        <p className="empty">Nenhuma notícia por aqui ainda.</p>
      )}
    </main>
  );
}
