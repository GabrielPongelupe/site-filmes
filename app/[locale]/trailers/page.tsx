import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByKind } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/trailers'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).kind.trailer } : {};
}

export default async function Page({ params }: PageProps<'/[locale]/trailers'>) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const t = getDictionary(l);
  return <CategoryPage l={l} eyebrow={t.list.guide} name={t.kind.trailer} intro={t.list.trailersIntro} items={newsByKind('trailer', l)} filters={false} />;
}
