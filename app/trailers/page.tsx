import type { Metadata } from 'next';
import { CategoryPage } from '@/components/CategoryPage';
import { newsByKind } from '@/lib/content';

export const metadata: Metadata = { title: 'Trailers' };

export default function Page() {
  return (
    <CategoryPage
      eyebrow="GUIA"
      name="Trailers"
      intro="Os trailers e teasers oficiais que movimentaram a semana, com o vídeo em cada notícia."
      items={newsByKind('trailer')}
      filters={false}
    />
  );
}
