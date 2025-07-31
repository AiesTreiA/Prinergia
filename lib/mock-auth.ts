"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  signIn: (provider: string) => Promise<void>
  signOut: () => void
}

export const useMockAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      signIn: async (provider: string) => {
        set({ isLoading: true })

        // Simular autenticación con Google
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockUser: User = {
          id: "1",
          name: "Usuario Demo",
          email: "demo@prinergia.com",
          image: "/images/therapy-session.jpg",
        }

        set({ user: mockUser, isLoading: false })
      },
      signOut: () => {
        set({ user: null, isLoading: false })
      },
    }),
    {
      name: "mock-auth-storage",
    },
  ),
)
