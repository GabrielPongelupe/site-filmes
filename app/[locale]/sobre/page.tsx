import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllNews } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, paths } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/sobre'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).footer.links.sobre } : {};
}

export default async function SobrePage({ params }: PageProps<'/[locale]/sobre'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  const r = paths(l);
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">{t.pages.aboutKicker}</span>
        <h1 className="display">Spoilado</h1>
        {t.pages.aboutText.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>{t.pages.aboutCount(getAllNews(l).length)}</p>
        <div className="generic__actions">
          <Link href={r.home} className="btn btn--primary">{t.pages.goHome}</Link>
          <Link href={r.privacidade} className="btn">{t.footer.links.privacidade}</Link>
        </div>
      </section>
    </main>
  );
}
