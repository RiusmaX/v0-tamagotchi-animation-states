import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuestsContent } from "./quests-content"

export default async function QuestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <QuestsContent />
}
