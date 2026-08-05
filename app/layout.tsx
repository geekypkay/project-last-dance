import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Pinyon_Script } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'block',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'block',
  preload: true,
})

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pinyon',
  display: 'block',
  preload: true,
})

export const metadata: Metadata = {
  title: '<3',
  description: 'Open this link privately.',
  generator: 'v0.app',
  openGraph: {
    title: '<3',
    description: 'Open this link privately.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '<3',
    description: 'Open this link privately.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f3ea',
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${cormorant.variable} ${inter.variable} ${pinyon.variable}`}>
      <head>
        {/* Preload critical fonts to prevent FOIT (Flash of Invisible Text) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
