'use client';

import { useState } from 'react';

// Filtros visuais; por enquanto só alternam o estado ativo.
export function Pills({ items, label }: { items: string[]; label: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="pills" role="group" aria-label={label}>
      {items.map((item, i) => (
        <button key={item} type="button" className="pill" aria-pressed={i === active} onClick={() => setActive(i)}>
          {item}
        </button>
      ))}
    </div>
  );
}
