import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import webpush from "web-push"

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  "mailto:support@tamagotchi.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr4qBXYaKedaVGmWKyM9FHI",
  process.env.VAPID_PRIVATE_KEY || "bdSiNzUhUP6rlKq9-3_2Pls3i7ZSK8LaRgP8LJnH8Ks",
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, monsterId, monsterName, state } = body

    if (!userId || !monsterId || !monsterName || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId)

    if (subError) throw subError
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions found" }, { status: 200 })
    }

    // Map state to notification message
    const stateMessages: Record<string, string> = {
      hungry: "a faim ! 🍔",
      sleepy: "est fatigué ! 😴",
      sad: "est triste ! 😢",
      sick: "est malade ! 🤒",
      dirty: "a besoin d'un bain ! 🛁",
      bored: "s'ennuie ! 🎮",
    }

    const message = stateMessages[state] || "a besoin de vous !"

    // Send notification to all subscriptions
    const notificationPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: `${monsterName} ${message}`,
            body: "Cliquez pour prendre soin de votre monstre !",
            url: `/monster/${monsterId}`,
            monsterId: monsterId,
          }),
        )
      } catch (error: any) {
        // If subscription is invalid, delete it
        if (error.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id)
        }
        console.error("[v0] Error sending notification:", error)
      }
    })

    await Promise.all(notificationPromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in send notification route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
