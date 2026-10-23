'use client';

import { useState } from 'react';

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

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
        {copied ? 'Link copiado!' : 'Copiar link'}
      </button>
    </div>
  );
}
