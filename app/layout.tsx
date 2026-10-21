import type { Metadata } from 'next';
import { Big_Shoulders, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';
import { LeaderboardAd } from '@/components/Ad';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Ticker } from '@/components/Ticker';
import './globals.css';

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

export const metadata: Metadata = {
  title: {
    default: 'Spoilado — cinema, séries e streaming',
    template: '%s · Spoilado',
  },
  description: 'Notícias, trailers e estreias de cinema e streaming, todo dia.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${bigShoulders.variable} ${schibsted.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        <Ticker />
        <LeaderboardAd />
        {children}
        <Footer />
      </body>
    </html>
  );
}
