import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[v0] Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Get metadata from the session
    const userId = session.metadata?.userId
    const coins = Number.parseInt(session.metadata?.coins || "0")

    console.log("[v0] Payment successful for user:", userId, "coins:", coins)

    if (!userId || !coins) {
      console.error("[v0] Missing metadata in session:", session.id)
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    try {
      const supabase = createAdminClient()

      // Get current coins
      const { data: profile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("coins")
        .eq("user_id", userId)
        .maybeSingle()

      if (fetchError) {
        console.error("[v0] Error fetching user profile:", fetchError)
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
      }

      // Calculate new coin amount
      const currentCoins = profile?.coins || 0
      const newCoins = currentCoins + coins

      // Update or insert the profile
      if (profile) {
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({ coins: newCoins })
          .eq("user_id", userId)

        if (updateError) {
          console.error("[v0] Error updating coins:", updateError)
          return NextResponse.json({ error: "Failed to update coins" }, { status: 500 })
        }
      } else {
        const { error: insertError } = await supabase.from("user_profiles").insert({ user_id: userId, coins: newCoins })

        if (insertError) {
          console.error("[v0] Error creating profile:", insertError)
          return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
        }
      }

      console.log("[v0] Successfully credited", coins, "coins to user", userId, "New total:", newCoins)
    } catch (error) {
      console.error("[v0] Error processing payment:", error)
      return NextResponse.json({ error: "Failed to credit coins" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
