'use client';

import { useSyncExternalStore } from 'react';
import { todayISO } from '@/lib/format';

const noop = () => () => {};

/** Data de hoje no navegador; no HTML estático usa a data do build. */
export function useToday(buildDate: string) {
  return useSyncExternalStore(noop, todayISO, () => buildDate);
}
