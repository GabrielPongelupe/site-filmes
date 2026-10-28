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
      <section className="nl-hero">
        <span className="kicker">{t.kicker}</span>
        <h1 className="display">{t.headline}</h1>
        <p className="nl-hero__lead">{t.intro}</p>
        <div className="nl-hero__form">
          <NewsletterForm l={l} />
          <p className="nl-hero__proof">{t.proof}</p>
        </div>
      </section>

      <section className="nl-benefits" aria-labelledby="nl-benefits-title">
        <h2 id="nl-benefits-title" className="nl-benefits__title">{t.benefitsTitle}</h2>
        <ul className="nl-benefits__grid">
          {t.benefits.map((b, i) => (
            <li key={b.title} className="nl-benefit">
              <span className="nl-benefit__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
