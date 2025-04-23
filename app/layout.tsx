import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vooomo TV - Live Streaming Platform',
  description: 'Watch your favorite TV channels live, anywhere, anytime.',
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