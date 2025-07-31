import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Leaf } from "lucide-react"
import Link from "next/link"

interface AuthErrorPageProps {
  searchParams: {
    error?: string
  }
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "Configuration":
        return "Hay un problema con la configuración del servidor."
      case "AccessDenied":
        return "Acceso denegado. No tienes permisos para acceder."
      case "Verification":
        return "El token de verificación ha expirado o ya fue usado."
      case "OAuthSignin":
        return "Error al iniciar sesión con Google. Inténtalo de nuevo."
      case "OAuthCallback":
        return "Error en el proceso de autenticación. Verifica tu configuración."
      case "OAuthCreateAccount":
        return "No se pudo crear la cuenta. Inténtalo más tarde."
      case "EmailCreateAccount":
        return "No se pudo crear la cuenta con este email."
      case "Callback":
        return "Error en el callback de autenticación."
      case "OAuthAccountNotLinked":
        return "Esta cuenta ya está vinculada con otro método de inicio de sesión."
      case "EmailSignin":
        return "No se pudo enviar el email de verificación."
      case "CredentialsSignin":
        return "Credenciales incorrectas. Verifica tus datos."
      case "SessionRequired":
        return "Debes iniciar sesión para acceder a esta página."
      default:
        return "Ha ocurrido un error inesperado durante el inicio de sesión."
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
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Error de Autenticación</CardTitle>
            <CardDescription className="text-center">{getErrorMessage(error)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Si el problema persiste, por favor contacta a nuestro equipo de soporte.
              </p>
              <div className="space-y-2">
                <Link href="/auth/signin">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Intentar de nuevo</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Error de desarrollo:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
