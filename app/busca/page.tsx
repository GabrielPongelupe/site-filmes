import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';
import { searchIndex } from '@/lib/content';

export const metadata: Metadata = { title: 'Busca' };

export default function BuscaPage() {
  return (
    <main className="container page--loose">
      <div className="page-head">
        <div>
          <span className="page-head__eyebrow">BUSCA</span>
          <h1 className="display">Buscar</h1>
        </div>
      </div>
      <div className="search-page">
        <Suspense>
          <SearchResults index={searchIndex()} />
        </Suspense>
      </div>
    </main>
  );
}
