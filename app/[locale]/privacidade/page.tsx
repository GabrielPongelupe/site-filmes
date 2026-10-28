import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, paths } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacidade'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).pages.privacyTitle } : {};
}

export default async function PrivacidadePage({ params }: PageProps<'/[locale]/privacidade'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l).pages;
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">{t.privacyKicker}</span>
        <h1 className="display">{t.privacyTitle}</h1>
        {t.privacyText.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="generic__actions">
          <Link href={paths(l).home} className="btn btn--primary">{t.backHome}</Link>
        </div>
      </section>
    </main>
  );
}
