const sizes = {
  '970x90': 'ad--970',
  '300x250': 'ad--300x250',
  '300x600': 'ad--300x600',
} as const;

type Props = {
  size: keyof typeof sizes;
  className?: string;
};

export function Ad({ size, className }: Props) {
  return (
    <div className={`ad ${sizes[size]} ${className ?? ''}`} aria-hidden="true">
      PUBLICIDADE · {size.replace('x', '×')}
    </div>
  );
}

export function LeaderboardAd() {
  return (
    <div className="container ad-leaderboard-wrap">
      <Ad size="970x90" />
    </div>
  );
}
