"use client"

import { useEffect, useState, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Leaf, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [focused, setFocused] = useState(false)

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
      const res = await signIn("email", { email, redirect: false, callbackUrl: "/" })
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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Error:", error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(142 60% 12%) 0%, hsl(160 50% 18%) 30%, hsl(200 55% 20%) 60%, hsl(142 45% 10%) 100%)",
        }}
      />

      {/* Decorative blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, hsl(142 70% 40%) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, hsl(200 70% 50%) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-[-15%] w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, hsl(160 60% 45%) 0%, transparent 70%)" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full opacity-40"
          style={{
            background: "hsl(142 70% 60%)",
            top: `${15 + i * 13}%`,
            left: `${8 + i * 14}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-12px) scale(1.2); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .slide-up { animation: slideUp 0.6s ease-out forwards; }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .slide-up-delay-1 { animation: slideUp 0.6s ease-out 0.1s both; }
        .slide-up-delay-2 { animation: slideUp 0.6s ease-out 0.2s both; }
        .slide-up-delay-3 { animation: slideUp 0.6s ease-out 0.3s both; }
      `}</style>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8 slide-up">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, hsl(142 60% 40%) 0%, hsl(160 55% 35%) 100%)" }}
            >
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Prinergia</span>
          </Link>
          <p className="text-white/60 mt-3 text-sm font-medium tracking-wide">
            Conecta con tu bienestar interior
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-1 slide-up-delay-1"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          <div
            className="rounded-[22px] p-8"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {error && (
              <div
                className="mb-6 p-4 rounded-2xl text-sm text-center"
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5" }}
              >
                Hubo un error al iniciar sesión. Por favor intenta de nuevo.
              </div>
            )}

            {isEmailSent ? (
              <div className="text-center space-y-5 py-4 fade-in">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, hsl(142 60% 40%) 0%, hsl(160 55% 35%) 100%)" }}
                >
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Revisa tu correo!</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Enviamos un enlace de acceso a{" "}
                    <span className="text-green-400 font-medium">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsEmailSent(false)}
                  className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-2"
                >
                  Intentar con otro correo
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-white mb-1">Bienvenido de nuevo</h2>
                  <p className="text-white/50 text-sm">Elige cómo quieres entrar</p>
                </div>

                {/* Google button — PRIMARY */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isEmailLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#1a1a1a",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  {isGoogleLoading ? "Conectando…" : "Continuar con Google"}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
                  <span className="text-xs text-white/30 font-medium tracking-wider uppercase">o con tu correo</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
                </div>

                {/* Email form */}
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4 transition-all duration-200"
                    style={{
                      background: "rgba(255, 255, 255, 0.07)",
                      border: `1px solid ${focused ? "rgba(74, 222, 128, 0.5)" : "rgba(255, 255, 255, 0.12)"}`,
                      boxShadow: focused ? "0 0 0 3px rgba(74, 222, 128, 0.1)" : "none",
                    }}
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" style={{ color: focused ? "hsl(142 70% 60%)" : "rgba(255,255,255,0.35)" }} />
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      required
                      disabled={isEmailLoading}
                      className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isEmailLoading || isGoogleLoading || !email}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: email
                        ? "linear-gradient(135deg, hsl(142 65% 42%) 0%, hsl(160 55% 38%) 100%)"
                        : "rgba(255,255,255,0.1)",
                      color: "white",
                      boxShadow: email ? "0 8px 24px rgba(34, 197, 94, 0.3)" : "none",
                    }}
                  >
                    {isEmailLoading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Recibir enlace mágico
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom links */}
        <div className="slide-up-delay-2 mt-6 space-y-3 text-center">
          <p className="text-white/40 text-xs">
            ¿Eres profesional del bienestar?{" "}
            <Link href="/register" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
              Únete como profesional →
            </Link>
          </p>
          <p className="text-white/25 text-xs">
            Al continuar, aceptas nuestros{" "}
            <Link href="#" className="hover:text-white/50 underline underline-offset-2 transition-colors">
              Términos
            </Link>{" "}
            y{" "}
            <Link href="#" className="hover:text-white/50 underline underline-offset-2 transition-colors">
              Privacidad
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="slide-up-delay-3 mt-8 flex items-center justify-center gap-6">
          {["100% seguro", "Sin contraseñas", "Acceso instantáneo"].map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-400/60" />
              <span className="text-white/35 text-xs">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(142 60% 12%)" }}>
        <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
