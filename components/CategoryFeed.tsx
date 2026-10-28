'use client';

import { useState } from 'react';
import { NewsCard } from '@/components/NewsCards';
import { kindLabel, type Kind, type NewsMeta } from '@/lib/content-shared';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

const PER_PAGE = 12;
const FILTERS: (Kind | 'tudo')[] = ['tudo', 'noticia', 'critica', 'trailer', 'bilheteria'];

function pageList(current: number, total: number) {
  const set = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

// Grade de notícias com filtro por tipo e paginação, tudo no navegador.
export function CategoryFeed({ items, l, filters = true }: { items: NewsMeta[]; l: Locale; filters?: boolean }) {
  const t = getDictionary(l).feed;
  const [kind, setKind] = useState<Kind | 'tudo'>('tudo');
  const [page, setPage] = useState(1);

  const available = FILTERS.filter((k) => k === 'tudo' || items.some((n) => n.kind === k));
  const filtered = kind === 'tudo' ? items : items.filter((n) => n.kind === kind);
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, total);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const go = (p: number) => {
    setPage(p);
    document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="feed" style={{ scrollMarginTop: 90 }}>
      {filters && available.length > 2 && (
        <div className="pills" role="group" aria-label={t.filter} style={{ marginBottom: 24 }}>
          {available.map((k) => (
            <button
              key={k}
              type="button"
              className="pill"
              aria-pressed={k === kind}
              onClick={() => {
                setKind(k);
                setPage(1);
              }}
            >
              {k === 'tudo' ? t.all : kindLabel(k, l)}
            </button>
          ))}
        </div>
      )}

      {shown.length ? (
        <div className="news-grid">
          {shown.map((n) => (
            <NewsCard key={n.slug} n={n} l={l} />
          ))}
        </div>
      ) : (
        <p className="empty">{t.empty}</p>
      )}

      {total > 1 && (
        <nav className="pagination" aria-label={t.pagination}>
          {pageList(current, total).map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`}>…</span>
            ) : (
              <button key={p} type="button" aria-current={p === current ? 'page' : undefined} onClick={() => go(p)}>
                {p}
              </button>
            ),
          )}
        </nav>
      )}
    </div>
  );
}
