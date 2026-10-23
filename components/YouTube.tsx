'use client';

/* eslint-disable @next/next/no-img-element -- miniatura remota do YouTube */
import { useState } from 'react';

// Player "leve": mostra a miniatura e só carrega o iframe do YouTube no clique.
export function YouTube({ id, title, size = 'md' }: { id: string; title?: string; size?: 'md' | 'lg' }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title ?? 'Vídeo'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" className="embed embed--poster" onClick={() => setPlaying(true)} aria-label={`Assistir: ${title ?? 'vídeo'}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" referrerPolicy="no-referrer" />
      <span className={`play ${size === 'lg' ? 'play--lg' : 'play--md'}`} aria-hidden="true">▶</span>
      {title && <span className="embed__label">{title}</span>}
    </button>
  );
}
