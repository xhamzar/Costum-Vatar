import type {Metadata} from 'next';
import {Plus_Jakarta_Sans, Fraunces, JetBrains_Mono} from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Malang Atelier — Avatar Costume & Cardigan Asset Studio',
  description:
    'Interactive 2D chibi avatar dress-up studio and exportable web costume asset generator featuring the One-Shoulder Slouchy Cardigan collection.',
  openGraph: {
    title: 'Malang Atelier — Avatar Costume & Cardigan Asset Studio',
    description:
      'Interactive 2D chibi avatar dress-up studio and exportable web costume asset generator featuring the One-Shoulder Slouchy Cardigan collection.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malang Atelier — Avatar Costume & Cardigan Asset Studio',
    description:
      'Interactive 2D chibi avatar dress-up studio and exportable web costume asset generator featuring the One-Shoulder Slouchy Cardigan collection.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#FAF8F5] text-[#231F20] font-sans antialiased selection:bg-[#A5B8D9]/30"
      >
        {children}
      </body>
    </html>
  );
}
