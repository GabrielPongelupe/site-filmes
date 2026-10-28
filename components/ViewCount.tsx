'use client';

import { useEffect, useState } from 'react';
import { EyeIcon, fmtViews } from '@/components/Views';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

// Bloco de visualizações dentro da notícia; depois de abrir a página, soma a visita do próprio leitor.
export function ViewCount({ views, l }: { views: number; l: Locale }) {
  const [own, setOwn] = useState(0);
  const label = getDictionary(l).views;

  useEffect(() => {
    const timer = setTimeout(() => setOwn(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="view-stat" title={label}>
      <span className="view-stat__icon"><EyeIcon size={20} /></span>
      <span className="view-stat__text">
        <strong suppressHydrationWarning>{fmtViews(views + own, l)}</strong>
        <span>{label}</span>
      </span>
    </div>
  );
}
