import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MonsterInteraction } from "@/components/monster-interaction"

export const revalidate = 30

export default async function MonsterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: monster, error } = await supabase
    .from("monsters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !monster) {
    redirect("/")
  }

  return <MonsterInteraction monster={monster} />
}
