import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/CategoryPage';
import { allTags, newsByTag } from '@/lib/content';


// Todos os caminhos são pré-gerados; slugs desconhecidos caem no notFound().
export const instant = false;

export function generateStaticParams() {
  return [...allTags().keys()].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps<'/tag/[tag]'>): Promise<Metadata> {
  const t = allTags().get((await params).tag);
  return t ? { title: `#${t.tag}` } : {};
}

export default async function TagPage({ params }: PageProps<'/tag/[tag]'>) {
  const slug = (await params).tag;
  const t = allTags().get(slug);
  if (!t) notFound();
  return <CategoryPage eyebrow={`TAG · ${t.count} ${t.count === 1 ? 'NOTÍCIA' : 'NOTÍCIAS'}`} name={`#${t.tag}`} items={newsByTag(slug)} />;
}
