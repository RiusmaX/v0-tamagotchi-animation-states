"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SignUpSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Merci pour votre inscription ! 🎉</CardTitle>
              <CardDescription>Vérifiez votre email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vous vous êtes inscrit avec succès. Veuillez vérifier votre email pour confirmer votre compte avant de
                vous connecter.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Aller à la connexion</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
