'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

export function ShareButtons({ l }: { l: Locale }) {
  const [copied, setCopied] = useState(false);
  const t = getDictionary(l).article;

  const url = () => window.location.href;

  return (
    <div className="share">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* sem permissão de área de transferência */
          }
        }}
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}
