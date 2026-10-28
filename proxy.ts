// Detecta o país/idioma do visitante e redireciona para a versão certa do site.
// Ordem: escolha salva no cookie → país (cabeçalho da Vercel) → idioma do navegador → padrão (pt-br).
import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, localeFromAcceptLanguage, localeFromCountry,
} from '@/lib/i18n';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split('/')[1];
  if (isLocale(first)) return;

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  // Em produção a Vercel envia o país; no localhost dá para simular com ?pais=ES.
  const country = request.headers.get('x-vercel-ip-country') ?? request.nextUrl.searchParams.get('pais');
  const locale =
    (isLocale(cookie) ? cookie : undefined) ??
    localeFromCountry(country) ??
    localeFromAcceptLanguage(request.headers.get('accept-language')) ??
    DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search.replace(/([?&])pais=[^&]*&?/, '$1').replace(/[?&]$/, '');
  // 307: o destino depende de quem acessa, então não deve ficar em cache como permanente.
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Ignora arquivos internos e estáticos (_next, favicon, imagens etc.)
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)'],
};
