import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import "./globals.css";
import Footer from "@/components/layout/Footer/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${raleway.variable} antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
        <Footer />
      </body>
      
    </html>
  )
}
