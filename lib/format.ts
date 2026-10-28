// Formatação de datas por idioma (funciona igual no servidor e no navegador).
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, LOCALE_INFO, type Locale } from '@/lib/i18n';

function parts(iso: string, timeZone: string) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour') % 24, min: get('minute') };
}

const tz = (locale: Locale) => LOCALE_INFO[locale].timeZone;
const months = (locale: Locale) => getDictionary(locale).time.months;

/** "21 out 2026, 18h32" / "21 oct 2026, 18:32" */
export function formatDateTime(iso: string, locale: Locale = DEFAULT_LOCALE) {
  const p = parts(iso, tz(locale));
  return getDictionary(locale).time.dateTime(p.d, months(locale)[p.m - 1], p.y, p.h, String(p.min).padStart(2, '0'));
}

/** "21 out 2026" */
export function formatDate(iso: string, locale: Locale = DEFAULT_LOCALE) {
  const p = parts(iso, tz(locale));
  return `${p.d} ${months(locale)[p.m - 1]} ${p.y}`;
}

/** "18:32" */
export function formatTime(iso: string, locale: Locale = DEFAULT_LOCALE) {
  const p = parts(iso, tz(locale));
  return `${String(p.h).padStart(2, '0')}:${String(p.min).padStart(2, '0')}`;
}

/** "23 OUT" a partir de "2026-10-23" */
export function formatDay(date: string, locale: Locale = DEFAULT_LOCALE) {
  const [, m, d] = date.split('-').map(Number);
  return `${d} ${months(locale)[m - 1].toUpperCase()}`;
}

/** "há 12 min" / "hace 12 min", "ontem" / "ayer", … ou a data, para mais de uma semana. */
export function timeAgo(iso: string, locale: Locale = DEFAULT_LOCALE, now = Date.now()) {
  const t = getDictionary(locale).time;
  const diff = Math.max(0, now - Date.parse(iso));
  const min = Math.floor(diff / 6e4);
  if (min < 60) return t.minutes(Math.max(1, min));
  const h = Math.floor(min / 60);
  if (h < 24) return t.hours(h);
  const days = Math.floor(h / 24);
  if (days === 1) return t.yesterday;
  if (days < 7) return t.days(days);
  return formatDate(iso, locale);
}

/** Data de hoje em Brasília, "AAAA-MM-DD" (o calendário de estreias usa datas do Brasil). */
export function todayISO(now = Date.now()) {
  const p = parts(new Date(now).toISOString(), LOCALE_INFO[DEFAULT_LOCALE].timeZone);
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function addDays(date: string, n: number) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Leitura estimada a partir do HTML. */
export function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
