import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/newsletter'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).newsletter.title } : {};
}

export default async function NewsletterPage({ params }: PageProps<'/[locale]/newsletter'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l).newsletter;
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">{t.kicker}</span>
        <h1 className="display">{t.title}</h1>
        <p>{t.intro}</p>
        <NewsletterForm l={l} />
      </section>
    </main>
  );
}
