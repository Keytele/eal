import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { siteOrigin } from '../content/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: 'EAL',
    template: '%s | EAL',
  },
  description: 'EAL electric vehicle experiences.',
};

interface RootLayoutProperties {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
