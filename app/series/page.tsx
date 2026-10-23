import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByCategory } from '@/lib/content';

export const metadata: Metadata = { title: 'Séries' };

export default function Page() {
  return <CategoryPage eyebrow="CATEGORIA" name="Séries" items={newsByCategory('series', 'streaming')} />;
}
