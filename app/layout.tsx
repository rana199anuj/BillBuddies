import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BillBuddies — Split Expenses with Friends',
  description: 'Easily split travel and group expenses with friends. Calculate who owes what and send WhatsApp reminders instantly.',
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
