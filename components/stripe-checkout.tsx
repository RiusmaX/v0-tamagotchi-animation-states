"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeCheckout({ productId }: { productId: string }) {
  const startCheckoutSessionForProduct = useCallback(() => startCheckoutSession(productId), [productId])

  return (
    <div id="checkout" className="w-full min-h-[600px]">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForProduct }}>
        <EmbeddedCheckout className="w-full" />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
