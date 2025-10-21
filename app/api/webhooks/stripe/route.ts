import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
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

    // Credit the coins to the user
    const supabase = await createClient()
    const { error } = await supabase.rpc("add_coins", {
      p_user_id: userId,
      p_amount: coins,
    })

    if (error) {
      console.error("[v0] Error crediting coins:", error)
      return NextResponse.json({ error: "Failed to credit coins" }, { status: 500 })
    }

    console.log("[v0] Successfully credited", coins, "coins to user", userId)
  }

  return NextResponse.json({ received: true })
}
