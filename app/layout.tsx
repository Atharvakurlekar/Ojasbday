import type { Metadata } from 'next'
import { Playfair_Display, Lato, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AudioProvider } from '@/components/audio-context'
import { AudioToggle } from '@/components/audio-toggle'
import { BIRTHDAY_NUMBER, BIRTHDAY_ORDINAL, RECIPIENT_NAME } from '@/lib/birthday'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['300', '400', '700'],
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: `Letters For ${RECIPIENT_NAME} — Happy ${BIRTHDAY_ORDINAL} Birthday`,
  description: `A cinematic birthday gift for ${RECIPIENT_NAME} — ${BIRTHDAY_NUMBER} letters from the people who love him most.`,
  openGraph: {
    title: `Letters For ${RECIPIENT_NAME} — Happy ${BIRTHDAY_ORDINAL} Birthday`,
    description: `${BIRTHDAY_NUMBER} letters from the people who love ${RECIPIENT_NAME} most. A birthday film.`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Letters For ${RECIPIENT_NAME} — Happy ${BIRTHDAY_ORDINAL} Birthday`,
    description: `${BIRTHDAY_NUMBER} letters from the people who love ${RECIPIENT_NAME} most.`,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${dancing.variable} bg-background`}>
      <body className="font-sans antialiased film-grain vignette">
        <AudioProvider>
          {children}
          <AudioToggle />
        </AudioProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
