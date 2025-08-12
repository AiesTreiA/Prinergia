import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-config"

// Crear el handler una sola vez
const handler = NextAuth(authOptions)

// Exportar como GET y POST
export { handler as GET, handler as POST }
