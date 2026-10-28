import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';
import { searchIndex } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/busca'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).search.title } : {};
}

export default async function BuscaPage({ params }: PageProps<'/[locale]/busca'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l).search;
  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow">{t.eyebrow}</span>
          <h1 className="display">{t.title}</h1>
        </div>
      </div>
      <div className="search-page">
        <Suspense>
          <SearchResults index={searchIndex(l)} l={l} />
        </Suspense>
      </div>
    </main>
  );
}
