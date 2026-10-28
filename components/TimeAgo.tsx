'use client';

import { useEffect, useState } from 'react';
import { formatDate, timeAgo } from '@/lib/format';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

// No HTML estático sai a data; no navegador vira "há X min/h/dias" (ou "hace X…").
export function TimeAgo({ date, l = DEFAULT_LOCALE, className }: { date: string; l?: Locale; className?: string }) {
  const [label, setLabel] = useState(() => formatDate(date, l));

  useEffect(() => {
    const update = () => setLabel(timeAgo(date, l));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [date, l]);

  return (
    <time dateTime={date} className={className} suppressHydrationWarning>
      {label}
    </time>
  );
}
