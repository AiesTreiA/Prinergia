import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AuthProvider from "@/components/auth/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prinergia - Conecta con tu Bienestar Interior",
  description:
    "Plataforma que conecta terapeutas, coaches, profesores de yoga y facilitadores de biodanza con personas que buscan bienestar emocional y corporal.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
