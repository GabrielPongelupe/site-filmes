import type { Metadata } from 'next';
import Link from 'next/link';
import { routes } from '@/lib/data';

// Página genérica para seções que ainda não existem
// (trailers, newsletter, busca, institucional etc.).
export const metadata: Metadata = { title: 'Em breve' };

export default function EmBrevePage() {
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">EM CONSTRUÇÃO</span>
        <h1 className="display">Em breve</h1>
        <p>Esta seção do Spoilado ainda está sendo preparada. Enquanto isso, veja as últimas notícias e as estreias da semana.</p>
        <div className="generic__actions">
          <Link href={routes.home} className="btn btn--primary">Voltar para a home</Link>
          <Link href={routes.estreias} className="btn">Estreias da semana</Link>
        </div>
      </section>
    </main>
  );
}
