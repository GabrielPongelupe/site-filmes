import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { categories } from '@/lib/data';

const cat = categories.series;

export const metadata: Metadata = { title: cat.name };

export default function Page() {
  return <CategoryPage name={cat.name} lead={cat.lead} />;
}
