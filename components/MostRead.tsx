import Link from 'next/link';
import { mostRead, routes } from '@/lib/data';

export function MostRead({ boxed = false }: { boxed?: boolean }) {
  return (
    <div className={`most-read ${boxed ? 'card' : ''}`}>
      <h3 className="display">Mais lidas</h3>
      {mostRead.map((title, i) => (
        <Link key={title} href={routes.noticia} className="most-read__item">
          <span className="most-read__n">{i + 1}</span>
          <span className="most-read__title">{title}</span>
        </Link>
      ))}
    </div>
  );
}
