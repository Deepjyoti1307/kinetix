import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kinetix — Personal Fitness & Nutrition Telemetry',
  description: 'Private single-user fitness and nutrition tracker PWA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kinetix',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-text-primary antialiased selection:bg-accent selection:text-canvas">
        {children}
      </body>
    </html>
  );
}
