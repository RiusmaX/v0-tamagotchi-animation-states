import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SuccessContent from "./success-content"

export const metadata = {
  title: "Paiement Réussi | Tamagotchi",
  description: "Votre paiement a été traité avec succès",
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SuccessContent sessionId={searchParams.session_id} />
}
