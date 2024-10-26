import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';




export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Felipe's Portfolio",
  description: "Felipe's Portfolio is a work in progress",
};

import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {

    // Validate that the incoming `locale` parameter is valid
    const isValidLocale = ['en', 'es'].includes(locale);
    if (!isValidLocale) notFound();
  
    // Enable static rendering
    setRequestLocale(locale);
    
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    return notFound();
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>      </body>
    </html>
  );
}
