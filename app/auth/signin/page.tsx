"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { Leaf, Mail } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  // Si el usuario ya está logeado, mandarlo al inicio inmediatamente
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsEmailLoading(true)
      const res = await signIn("email", { 
        email, 
        redirect: false,
        callbackUrl: "/" 
      })
      
      if (res?.error) {
        console.error("Error signing in with email:", res.error)
      } else {
        setIsEmailSent(true)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Prinergia</span>
          </Link>
          <p className="text-gray-600 mt-2">Conecta con tu bienestar interior</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenido</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center mb-4 border border-red-200">
                Hubo un error de inicio de sesión. 
                Error técnico: <strong>{error}</strong>. Revisa los logs de la terminal.
              </div>
            )}

            {isEmailSent ? (
               <div className="text-center space-y-4 p-4 bg-green-50 rounded-lg">
                 <Mail className="mx-auto h-8 w-8 text-green-600" />
                 <h3 className="font-semibold text-green-800">Revisa tu correo</h3>
                 <p className="text-sm text-green-700">
                   Te hemos enviado un enlace mágico a <strong>{email}</strong>. Haz clic en el enlace para iniciar sesión.
                 </p>
                 <Button 
                   variant="outline" 
                   onClick={() => setIsEmailSent(false)}
                   className="mt-2 text-sm"
                 >
                   Intentar con otro correo
                 </Button>
               </div>
            ) : (
               <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={isEmailLoading}
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isEmailLoading}>
                  {isEmailLoading ? "Conectando..." : "Continuar con tu correo"}
                </Button>
               </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <GoogleSignInButton />

            <div className="space-y-3 mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Eres un profesional del bienestar?{" "}
                  <Link href="/register" className="text-green-600 hover:underline font-medium">
                    Crea tu perfil profesional
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          Al continuar, aceptas nuestros{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
