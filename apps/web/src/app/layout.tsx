import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppChrome } from '@/components/AppChrome';

export const metadata: Metadata = {
  title: 'RG Media — Content Operations',
  description: 'Content production, calendar, and publishing for RG Marketing',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'RG Media' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f1117',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
