import type React from "react"
import type { Metadata } from "next"
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const fraunces = Fraunces({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"], 
  variable: "--font-fraunces" 
})
const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"], 
  variable: "--font-mono" 
})

export const metadata: Metadata = {
  title: "Raíz — Red de linajes de bienestar",
  description:
    "Mapeamos las escuelas y linajes de Biodanza, Yoga, Temazcal, Reiki y Sonoterapia en Chile, Argentina y Colombia. Encuentra tu fuego más cercano.",
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
  }
}


import { NextAuthProvider } from "@/components/auth/provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${fraunces.variable} ${ibmPlexMono.variable}`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
