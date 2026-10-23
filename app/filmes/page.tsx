import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByCategory } from '@/lib/content';

export const metadata: Metadata = { title: 'Filmes' };

export default function Page() {
  return <CategoryPage eyebrow="CATEGORIA" name="Filmes" items={newsByCategory('filmes')} />;
}
