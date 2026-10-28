import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByCategory } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/series'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).category.series } : {};
}

export default async function Page({ params }: PageProps<'/[locale]/series'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  return <CategoryPage l={l} eyebrow={t.list.category} name={t.category.series} items={newsByCategory(l, 'series', 'streaming')} />;
}
