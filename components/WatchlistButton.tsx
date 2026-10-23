'use client';

import { useSyncExternalStore } from 'react';

const KEY = 'spoilado:quero-assistir';
const EVENT = 'spoilado:watchlist';

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(EVENT, cb);
  };
}

// Lista "Quero assistir" salva só no navegador do leitor.
export function WatchlistButton({ slug }: { slug: string }) {
  const saved = useSyncExternalStore(subscribe, () => read().includes(slug), () => false);

  const toggle = () => {
    const list = read().filter((s) => s !== slug);
    if (!saved) list.push(slug);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* armazenamento bloqueado */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button type="button" className="btn" onClick={toggle} aria-pressed={saved}>
      {saved ? '✓ Na sua lista' : '+ Quero assistir'}
    </button>
  );
}
