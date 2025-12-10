import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

const raleway = Raleway({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'Purple Dog - Plateforme de vente d\'objets de valeur',
  description: 'Vendez et achetez des objets d\'art, antiquités et objets de collection entre particuliers et professionnels',
  keywords: ['objets d\'art', 'antiquités', 'vente', 'enchères'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${raleway.variable}`}>
      <body className="font-raleway">{children}</body>
    </html>
  )
}
