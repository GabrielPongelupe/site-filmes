import Link from 'next/link';
import { routes } from '@/lib/data';

export default function NotFound() {
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">ERRO 404</span>
        <h1 className="display">Cena cortada</h1>
        <p>A página que você procura não existe ou foi removida.</p>
        <div className="generic__actions">
          <Link href={routes.home} className="btn btn--primary">Voltar para a home</Link>
        </div>
      </section>
    </main>
  );
}
