import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByKind } from '@/lib/content';

export const metadata: Metadata = { title: 'Bilheteria' };

export default function Page() {
  return (
    <CategoryPage
      eyebrow="GUIA"
      name="Bilheteria"
      intro="Os números das bilheterias no Brasil e no mundo."
      items={newsByKind('bilheteria')}
      filters={false}
    />
  );
}
