import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, paths } from '@/lib/i18n';

// Página genérica para seções que ainda não existem (newsletter, anuncie, contato).
export async function generateMetadata({ params }: PageProps<'/[locale]/em-breve'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).pages.soonTitle } : {};
}

export default async function EmBrevePage({ params }: PageProps<'/[locale]/em-breve'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  const r = paths(l);
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">{t.pages.soonKicker}</span>
        <h1 className="display">{t.pages.soonTitle}</h1>
        <p>{t.pages.soonText}</p>
        <div className="generic__actions">
          <Link href={r.home} className="btn btn--primary">{t.pages.backHome}</Link>
          <Link href={r.emAlta} className="btn">{t.nav.emAlta}</Link>
        </div>
      </section>
    </main>
  );
}
