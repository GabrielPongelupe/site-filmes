import Link from 'next/link';
import { locale } from 'next/root-params';
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, isLocale, paths } from '@/lib/i18n';

export default async function NotFound() {
  const value = await locale();
  const l = isLocale(value) ? value : DEFAULT_LOCALE;
  const t = getDictionary(l).pages;
  return (
    <main className="container">
      <section className="generic">
        <span className="kicker">{t.notFoundKicker}</span>
        <h1 className="display">{t.notFoundTitle}</h1>
        <p>{t.notFoundText}</p>
        <div className="generic__actions">
          <Link href={paths(l).home} className="btn btn--primary">{t.backHome}</Link>
        </div>
      </section>
    </main>
  );
}
