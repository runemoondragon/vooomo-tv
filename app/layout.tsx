import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vooomo Tv - Live Streaming Platform',
  description: 'Watch your favorite TV channels live, anywhere, anytime.',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 