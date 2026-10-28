// Newsletter: inscritos guardados num hash do Upstash Redis (criado pelo Marketplace da Vercel).
// Usa a API REST do Upstash direto com fetch — sem dependências.
//
// Variáveis de ambiente (a integração da Vercel cria as duas primeiras automaticamente):
//   KV_REST_API_URL / KV_REST_API_TOKEN   (ou UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
//   NEWSLETTER_ADMIN_TOKEN                senha para listar os e-mails (você define)

const KEY = 'newsletter:inscritos';

export type Subscriber = { email: string; locale: string; createdAt: string };

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function newsletterConfigured() {
  return redisConfig() !== null;
}

async function redis<T>(command: (string | number)[]): Promise<T> {
  const cfg = redisConfig();
  if (!cfg) throw new Error('Banco da newsletter não configurado');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(data.error ?? `Upstash respondeu ${res.status}`);
  return data.result as T;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : null;
}

/** Inscreve um e-mail. Retorna false se ele já estava inscrito. */
export async function subscribe(email: string, locale: string): Promise<boolean> {
  const value: Omit<Subscriber, 'email'> = { locale, createdAt: new Date().toISOString() };
  const added = await redis<number>(['HSETNX', KEY, email, JSON.stringify(value)]);
  return added === 1;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  // HGETALL devolve [campo1, valor1, campo2, valor2, ...]
  const flat = await redis<string[]>(['HGETALL', KEY]);
  const list: Subscriber[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    let meta: Partial<Subscriber> = {};
    try {
      meta = JSON.parse(flat[i + 1]);
    } catch {
      /* valor antigo/inválido */
    }
    list.push({ email: flat[i], locale: meta.locale ?? '', createdAt: meta.createdAt ?? '' });
  }
  return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
