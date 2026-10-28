'use client';

/* eslint-disable @next/next/no-img-element -- imagens remotas */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { SearchEntry } from '@/lib/content-shared';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/lib/format';
import { paths, type Locale } from '@/lib/i18n';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function SearchResults({ index, l }: { index: SearchEntry[]; l: Locale }) {
  const t = getDictionary(l);
  const params = useSearchParams();
  const [q, setValue] = useState(() => params.get('q') ?? '');
  // Mantém a URL em sincronia (para compartilhar a busca) sem recarregar a página.
  const setQ = (value: string) => {
    setValue(value);
    window.history.replaceState(null, '', value ? `?q=${encodeURIComponent(value)}` : window.location.pathname);
  };

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((e) => {
        const title = norm(e.title);
        const rest = norm([e.dek, ...e.tags, ...e.titles].join(' '));
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 3;
          else if (rest.includes(t)) score += 1;
          else return null;
        }
        return { e, score };
      })
      .filter((x): x is { e: SearchEntry; score: number } => x !== null)
      .sort((a, b) => b.score - a.score || Date.parse(b.e.date) - Date.parse(a.e.date))
      .slice(0, 40)
      .map((x) => x.e);
  }, [q, index]);

  return (
    <>
      <form
        className="search search--big"
        role="search"
        onSubmit={(ev) => ev.preventDefault()}
      >
        <input
          type="search"
          name="q"
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder={t.header.search}
          aria-label={t.header.searchAria}
          autoFocus
        />
      </form>

      {q.trim() && (
        <p className="search-count">
          {results.length ? t.search.count(results.length, q.trim()) : t.search.none(q.trim())}
        </p>
      )}

      <div>
        {results.map((e) => (
          <Link key={e.slug} href={paths(l).noticia(e.slug)} className="feed-item">
            <div className="feed-item__img media placeholder placeholder--sm">
              <img src={e.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
            </div>
            <div className="feed-item__body">
              <span className="kicker">{e.kicker}</span>
              <h3>{e.title}</h3>
              <p>{e.dek}</p>
              <span className="meta">{formatDate(e.date, l)}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
