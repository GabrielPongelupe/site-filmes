'use client';

import { useEffect, useState } from 'react';
import { EyeIcon, fmtViews } from '@/components/Views';

// Bloco de visualizações dentro da notícia; depois de abrir a página, soma a visita do próprio leitor.
export function ViewCount({ views }: { views: number }) {
  const [own, setOwn] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setOwn(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="view-stat" title="Visualizações">
      <span className="view-stat__icon"><EyeIcon size={20} /></span>
      <span className="view-stat__text">
        <strong suppressHydrationWarning>{fmtViews(views + own)}</strong>
        <span>visualizações</span>
      </span>
    </div>
  );
}
