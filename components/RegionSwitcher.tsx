'use client';

import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';
import { LOCALE_COOKIE, LOCALE_INFO, LOCALES, switchLocalePath, type Locale } from '@/lib/i18n';

// Seletor de país/idioma: grava a escolha num cookie (que vale mais que a detecção automática) e troca a URL.
export function RegionSwitcher({ l, compact = false, className = '' }: { l: Locale; compact?: boolean; className?: string }) {
  const pathname = usePathname();
  const t = getDictionary(l).region;

  return (
    <label className={`region ${compact ? 'region--compact' : ''} ${className}`}>
      <span className="sr-only">{t.change}</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      {compact && <span className="region__short" aria-hidden="true">{LOCALE_INFO[l].short}</span>}
      <select
        value={l}
        onChange={(e) => {
          const to = e.target.value as Locale;
          document.cookie = `${LOCALE_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
          window.location.assign(switchLocalePath(pathname, to) + window.location.search);
        }}
      >
        {LOCALES.map((x) => (
          <option key={x} value={x}>
            {LOCALE_INFO[x].label}
          </option>
        ))}
      </select>
    </label>
  );
}
