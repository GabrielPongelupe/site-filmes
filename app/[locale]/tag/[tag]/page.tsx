import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/CategoryPage';
import { allTags, newsByTag } from '@/lib/content';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/i18n';

// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return [...allTags().keys()].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/tag/[tag]'>): Promise<Metadata> {
  const t = allTags().get((await params).tag);
  return t ? { title: `#${t.tag}` } : {};
}

export default async function TagPage({ params }: PageProps<'/[locale]/tag/[tag]'>) {
  const { locale: l, tag: slug } = await params;
  if (!isLocale(l)) notFound();
  const t = allTags().get(slug);
  if (!t) notFound();
  return <CategoryPage l={l} eyebrow={getDictionary(l).list.tag(t.count)} name={`#${t.tag}`} items={newsByTag(slug, l)} />;
}
