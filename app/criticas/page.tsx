import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByKind } from '@/lib/content';

export const metadata: Metadata = { title: 'Críticas' };

export default function Page() {
  return (
    <CategoryPage
      eyebrow="GUIA"
      name="Críticas"
      intro="O que a crítica especializada está dizendo sobre os lançamentos de cinema e streaming."
      items={newsByKind('critica')}
      filters={false}
    />
  );
}
