import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://billbuddies.vercel.app'),
  title: 'BillBuddies — Split Expenses with Friends',
  description: 'Easily split travel and group expenses with friends. Calculate who owes what and send WhatsApp reminders instantly.',
  keywords: ['split bills', 'expense tracker', 'friends expenses', 'travel bill splitter', 'whatsapp payment reminder', 'group expenses'],
  openGraph: {
    title: 'BillBuddies — Settle up fast!',
    description: 'Track group expenses, calculate who owes what, and send WhatsApp payment reminders automatically.',
    url: 'https://billbuddies.vercel.app', // Update with actual domain
    siteName: 'BillBuddies',
    images: [
      {
        url: '/logo.png', // The new logo we just made
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillBuddies — Split Expenses with Friends',
    description: 'Easily track and split bills with friends seamlessly.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-8SMEXST0P0" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8SMEXST0P0');
        `}} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
