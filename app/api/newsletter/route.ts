// POST /api/newsletter  { email, locale }       → inscreve
// GET  /api/newsletter  (Authorization: Bearer <NEWSLETTER_ADMIN_TOKEN>) → lista os inscritos
//      /api/newsletter?formato=csv               → mesma lista em CSV
import { timingSafeEqual } from 'node:crypto';
import { isLocale } from '@/lib/i18n';
import { listSubscribers, newsletterConfigured, normalizeEmail, subscribe } from '@/lib/newsletter';

export async function POST(request: Request) {
  if (!newsletterConfigured()) {
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  // Campo "isca" invisível no formulário: robôs preenchem, pessoas não.
  if (typeof body.website === 'string' && body.website) return Response.json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  const locale = typeof body.locale === 'string' && isLocale(body.locale) ? body.locale : 'pt-br';

  try {
    const isNew = await subscribe(email, locale);
    return Response.json({ ok: true, alreadySubscribed: !isNew }, { status: isNew ? 201 : 200 });
  } catch {
    return Response.json({ ok: false, error: 'storage_error' }, { status: 502 });
  }
}

function authorized(request: Request) {
  const expected = process.env.NEWSLETTER_ADMIN_TOKEN;
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!newsletterConfigured()) return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });

  const subscribers = await listSubscribers();
  if (new URL(request.url).searchParams.get('formato') === 'csv') {
    const csv = ['email,idioma,inscrito_em', ...subscribers.map((s) => `${s.email},${s.locale},${s.createdAt}`)].join('\n');
    return new Response(csv, {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="newsletter.csv"' },
    });
  }
  return Response.json({ ok: true, total: subscribers.length, subscribers });
}
