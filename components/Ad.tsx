import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

const sizes = {
  '970x90': 'ad--970',
  '300x250': 'ad--300x250',
  '300x600': 'ad--300x600',
} as const;

type Props = {
  size: keyof typeof sizes;
  l?: Locale;
  className?: string;
};

export function Ad({ size, l = DEFAULT_LOCALE, className }: Props) {
  return (
    <div className={`ad ${sizes[size]} ${className ?? ''}`} aria-hidden="true">
      {getDictionary(l).ad} · {size.replace('x', '×')}
    </div>
  );
}

export function LeaderboardAd({ l }: { l: Locale }) {
  return (
    <div className="container ad-leaderboard-wrap">
      <Ad size="970x90" l={l} />
    </div>
  );
}
