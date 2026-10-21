'use client';

import Link from 'next/link';
import { useState } from 'react';
import { platforms, routes } from '@/lib/data';

export function StreamingTabs() {
  const [tab, setTab] = useState(0);

  return (
    <section className="section streaming-box">
      <div className="streaming-box__head">
        <h2 className="display section-title">Chegou no streaming</h2>
        <div className="pills" role="tablist" aria-label="Plataformas">
          {platforms.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              className="pill"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-4" role="tabpanel">
        {platforms[tab].items.map((it) => (
          <Link key={it.title} href={routes.titulo} className="poster-card">
            <div className="poster-card__img placeholder placeholder--poster">
              [ pôster ]
              <span className="poster-card__date">{it.date}</span>
            </div>
            <div className="poster-card__text">
              <h3>{it.title}</h3>
              <span className="poster-card__type">{it.type}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
