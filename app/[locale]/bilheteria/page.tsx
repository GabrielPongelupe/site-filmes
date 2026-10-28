import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByKind } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/bilheteria'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).kind.bilheteria } : {};
}

export default async function Page({ params }: PageProps<'/[locale]/bilheteria'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  return <CategoryPage l={l} eyebrow={t.list.guide} name={t.kind.bilheteria} intro={t.list.bilheteriaIntro} items={newsByKind('bilheteria', l)} filters={false} />;
}
