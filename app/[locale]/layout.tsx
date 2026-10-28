import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Big_Shoulders, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Ticker } from '@/components/Ticker';
import { getDictionary } from '@/lib/dictionaries';
import { DEFAULT_LOCALE, isLocale, LOCALE_INFO, LOCALES } from '@/lib/i18n';
import '../globals.css';

const bigShoulders = Big_Shoulders({
  variable: '--font-big-shoulders',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  adjustFontFallback: false,
});

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '600'],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE).meta;
  return {
    title: { default: t.title, template: '%s · Spoilado' },
    description: t.description,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={LOCALE_INFO[locale].lang} className={`${bigShoulders.variable} ${schibsted.variable} ${jetbrains.variable}`}>
      <body>
        <Header l={locale} />
        <Ticker l={locale} />
        {children}
        <Footer l={locale} />
      </body>
    </html>
  );
}
