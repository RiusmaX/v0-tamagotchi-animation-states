import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion - Tamagotchi",
  description: "Connectez-vous pour accéder à vos monstres",
}

export default function LoginPage() {
  return (
    <div className="flex h-svh w-full items-center justify-center p-4 md:p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-auto">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="text-center mb-2 md:mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">🐾 Tamagotchi</h1>
            <p className="text-sm md:text-base text-muted-foreground">Prenez soin de vos petits monstres</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
