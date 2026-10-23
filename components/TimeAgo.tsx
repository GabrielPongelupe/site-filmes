'use client';

import { useEffect, useState } from 'react';
import { formatDate, timeAgo } from '@/lib/format';

// No HTML estático sai a data; no navegador vira "há X min/h/dias".
export function TimeAgo({ date, className }: { date: string; className?: string }) {
  const [label, setLabel] = useState(() => formatDate(date));

  useEffect(() => {
    const update = () => setLabel(timeAgo(date));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <time dateTime={date} className={className} suppressHydrationWarning>
      {label}
    </time>
  );
}
