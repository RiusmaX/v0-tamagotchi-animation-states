"use server"

import { stripe } from "@/lib/stripe"
import { COIN_PACKAGES } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function startCheckoutSession(productId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const product = COIN_PACKAGES.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      userId: user.id,
      coins: product.coins.toString(),
      productId: product.id,
    },
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/buy-coins/success?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}
