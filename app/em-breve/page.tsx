import type { Metadata } from 'next';
import Link from 'next/link';
import { routes } from '@/lib/data';

// Página genérica para seções que ainda não existem (newsletter, anuncie, contato).
export const metadata: Metadata = { title: 'Em breve' };

export default function EmBrevePage() {
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">EM CONSTRUÇÃO</span>
        <h1 className="display">Em breve</h1>
        <p>Esta seção do Spoilado ainda está sendo preparada. Enquanto isso, veja as últimas notícias e o que está em alta.</p>
        <div className="generic__actions">
          <Link href={routes.home} className="btn btn--primary">Voltar para a home</Link>
          <Link href={routes.emAlta} className="btn">Em alta</Link>
        </div>
      </section>
    </main>
  );
}
