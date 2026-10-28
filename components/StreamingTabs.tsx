'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Media } from '@/components/Media';
import { TimeAgo } from '@/components/TimeAgo';
import { Views } from '@/components/Views';
import type { NewsMeta, StreamingRelease } from '@/lib/content-shared';
import { getDictionary } from '@/lib/dictionaries';
import { addDays, formatDay } from '@/lib/format';
import { paths, type Locale } from '@/lib/i18n';
import { useToday } from '@/lib/useToday';

const PER_TAB = 4;
const RECENT_DAYS = 30;

type Props = {
  platforms: string[];
  /** notícias por plataforma, mais nova primeiro */
  news: Record<string, NewsMeta[]>;
  /** calendário de lançamentos, usado quando faltam notícias recentes */
  releases: StreamingRelease[];
  buildDate: string;
  l: Locale;
};

function NewsPoster({ n, l }: { n: NewsMeta; l: Locale }) {
  return (
    <Link href={paths(l).noticia(n.slug)} className="poster-card">
      <Media src={n.image.src} alt={n.image.alt} variant="poster" className="poster-card__img poster-card__img--wide">
        <span className="poster-card__date">{formatDay(n.date.slice(0, 10), l)}</span>
        {n.video && <span className="poster-card__play" aria-hidden="true">▶</span>}
        <Views n={n.views} l={l} overlay />
      </Media>
      <div className="poster-card__text">
        <h3>{n.title}</h3>
        <span className="poster-card__type">
          {n.titles[0]?.name ? `${n.titles[0].name} · ` : ''}
          <TimeAgo date={n.date} l={l} />
        </span>
      </div>
    </Link>
  );
}

function ReleasePoster({ r, l }: { r: StreamingRelease; l: Locale }) {
  const t = getDictionary(l);
  return (
    <div className="poster-card">
      <Media src={r.poster} alt={`Pôster de ${r.title}`} label={t.streaming.placeholder} variant="poster" className="poster-card__img poster-card__img--wide">
        <span className="poster-card__date">{formatDay(r.date, l)}</span>
      </Media>
      <div className="poster-card__text">
        <h3>{r.title}</h3>
        <span className="poster-card__type">{t.releaseType[r.type] ?? r.type} · {t.genre[r.genre] ?? r.genre}</span>
      </div>
    </div>
  );
}

// "Chegou no streaming": por plataforma, primeiro as notícias recentes sobre o que chegou e está repercutindo,
// depois os lançamentos do calendário e, se ainda faltar, notícias mais antigas.
export function StreamingTabs({ platforms, news, releases, buildDate, l }: Props) {
  const t = getDictionary(l).streaming;
  const today = useToday(buildDate);
  const tabs = platforms.filter((p) => news[p]?.length || releases.some((r) => r.platform === p));
  const [tab, setTab] = useState(0);

  if (!tabs.length) return null;

  const platform = tabs[Math.min(tab, tabs.length - 1)];
  const all = news[platform] ?? [];
  const cutoff = addDays(today, -RECENT_DAYS);
  const recent = all.filter((n) => n.date.slice(0, 10) >= cutoff).slice(0, PER_TAB);
  const covered = all.flatMap((n) => n.titles.map((t) => t.name.toLowerCase()));
  const extra = releases
    .filter((r) => r.platform === platform && r.date <= today && r.date >= cutoff)
    .reverse()
    .filter((r) => !covered.some((c) => r.title.toLowerCase().startsWith(c)))
    .slice(0, PER_TAB - recent.length);
  const older = all.filter((n) => !recent.includes(n)).slice(0, PER_TAB - recent.length - extra.length);

  return (
    <section className="section streaming-box">
      <div className="streaming-box__head">
        <h2 className="display section-title">{t.title}</h2>
        <div className="pills" role="tablist" aria-label={t.tabs}>
          {tabs.map((p) => (
            <button key={p} type="button" role="tab" className="pill" aria-selected={p === platform} onClick={() => setTab(tabs.indexOf(p))}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-4" role="tabpanel" aria-label={platform}>
        {recent.map((n) => <NewsPoster key={n.slug} n={n} l={l} />)}
        {extra.map((r) => <ReleasePoster key={r.title + r.date} r={r} l={l} />)}
        {older.map((n) => <NewsPoster key={n.slug} n={n} l={l} />)}
      </div>
    </section>
  );
}
