// Formatação de datas no fuso de Brasília (funciona igual no servidor e no navegador).
const TZ = 'America/Sao_Paulo';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function parts(iso: string) {
  const d = new Date(iso);
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour') % 24, min: get('minute') };
}

/** "21 out 2026, 18h32" */
export function formatDateTime(iso: string) {
  const p = parts(iso);
  return `${p.d} ${MONTHS[p.m - 1]} ${p.y}, ${p.h}h${String(p.min).padStart(2, '0')}`;
}

/** "21 out 2026" */
export function formatDate(iso: string) {
  const p = parts(iso);
  return `${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
}

/** "18:32" */
export function formatTime(iso: string) {
  const p = parts(iso);
  return `${String(p.h).padStart(2, '0')}:${String(p.min).padStart(2, '0')}`;
}

/** "23 OUT" a partir de "2026-10-23" */
export function formatDay(date: string) {
  const [, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1].toUpperCase()}`;
}

/** "quinta, 23 out" a partir de "2026-10-23" */
export function formatWeekday(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  const wd = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${wd}, ${d} ${MONTHS[m - 1]}`;
}

/** "há 12 min", "há 3 h", "ontem", "há 4 dias" ou a data, para mais de uma semana. */
export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - Date.parse(iso));
  const min = Math.floor(diff / 6e4);
  if (min < 60) return `há ${Math.max(1, min)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  return formatDate(iso);
}

/** Data de hoje em Brasília, "AAAA-MM-DD". */
export function todayISO(now = Date.now()) {
  const p = parts(new Date(now).toISOString());
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function addDays(date: string, n: number) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Quinta-feira que abre a semana de cinema (quinta a quarta) que contém a data. */
export function cinemaWeekStart(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDays(date, -((wd - 4 + 7) % 7));
}

/** Leitura estimada a partir do HTML. */
export function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
