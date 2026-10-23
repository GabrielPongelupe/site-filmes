import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNews } from '@/lib/content';
import { routes } from '@/lib/data';

export const metadata: Metadata = { title: 'Sobre' };

export default function SobrePage() {
  const total = getAllNews().length;
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">SOBRE</span>
        <h1 className="display">Spoilado</h1>
        <p>O Spoilado reúne notícias, trailers e estreias de cinema e streaming para o público brasileiro, todos os dias.</p>
        <p>
          Cada notícia é escrita pela nossa redação a partir de fontes públicas, sempre listadas ao fim do texto. Imagens e
          vídeos vêm de canais oficiais de estúdios e plataformas, do Wikimedia Commons e do TMDB, com o crédito indicado.
        </p>
        <p>Hoje são {total} notícias publicadas.</p>
        <div className="generic__actions">
          <Link href={routes.home} className="btn btn--primary">Ir para a home</Link>
          <Link href={routes.privacidade} className="btn">Privacidade</Link>
        </div>
      </section>
    </main>
  );
}
