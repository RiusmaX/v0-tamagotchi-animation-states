import { SignUpForm } from "@/components/auth/sign-up-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inscription - Tamagotchi",
  description: "Créez votre compte pour commencer l'aventure",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">🐾 Tamagotchi</h1>
            <p className="text-muted-foreground">Créez votre compte</p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
