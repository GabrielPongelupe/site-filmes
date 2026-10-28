'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type Status = 'idle' | 'sending' | 'success' | 'already' | 'invalid' | 'error';

export function NewsletterForm({ l }: { l: Locale }) {
  const t = getDictionary(l).newsletter;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), website: form.get('website'), locale: l }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setStatus(data.alreadySubscribed ? 'already' : 'success');
      else setStatus(data.error === 'invalid_email' ? 'invalid' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const done = status === 'success' || status === 'already';
  const message = status === 'idle' || status === 'sending' ? null : t[status];

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate>
      {!done && (
        <div className="newsletter-form__row">
          <input type="email" name="email" required autoComplete="email" placeholder={t.email} aria-label={t.email} />
          {/* isca para robôs: invisível para pessoas */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="newsletter-form__trap" aria-hidden="true" />
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
            {status === 'sending' ? t.sending : t.submit}
          </button>
        </div>
      )}
      {message && (
        <p className={`newsletter-form__msg ${done ? 'is-ok' : 'is-error'}`} role="status">
          {message}
        </p>
      )}
      <p className="newsletter-form__consent">{t.consent}</p>
    </form>
  );
}
