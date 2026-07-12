export function isV0Environment(): boolean {
  if (typeof window === "undefined") {
    return process.env.VERCEL_ENV === "preview" && process.env.NEXT_PUBLIC_V0 === "true"
  }

  return (
    window.location.hostname.includes("v0.dev")
  )
}

export function useAuthSystem() {
  return isV0Environment() ? "mock" : "nextauth"
}
