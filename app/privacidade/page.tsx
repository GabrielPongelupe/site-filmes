import type { Metadata } from 'next';
import Link from 'next/link';
import { routes } from '@/lib/data';

export const metadata: Metadata = { title: 'Privacidade' };

export default function PrivacidadePage() {
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">PRIVACIDADE</span>
        <h1 className="display">Privacidade</h1>
        <p>O Spoilado não tem cadastro, não usa cookies próprios e não coleta dados pessoais.</p>
        <p>
          A lista “Quero assistir” fica salva só no seu navegador e pode ser apagada limpando os dados do site. Os vídeos
          usam o modo de privacidade aprimorada do YouTube e só carregam quando você clica para assistir.
        </p>
        <div className="generic__actions">
          <Link href={routes.home} className="btn btn--primary">Voltar para a home</Link>
        </div>
      </section>
    </main>
  );
}
