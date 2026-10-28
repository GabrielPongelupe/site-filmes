import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, LOCALE_INFO, type Locale } from '@/lib/i18n';

export function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export const fmtViews = (n: number, locale: Locale = DEFAULT_LOCALE) => n.toLocaleString(LOCALE_INFO[locale].lang);

/** Olho + número. `overlay` = selo sobre a imagem do card. */
export function Views({ n, l = DEFAULT_LOCALE, overlay = false }: { n: number; l?: Locale; overlay?: boolean }) {
  const label = getDictionary(l).views;
  return (
    <span className={overlay ? 'views-badge' : 'views-inline'} title={`${fmtViews(n, l)} ${label}`}>
      <EyeIcon size={overlay ? 15 : 14} />
      <span>{fmtViews(n, l)}</span>
      <span className="sr-only"> {label}</span>
    </span>
  );
}
