"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { addCoins } from "@/lib/currency"
import { emitWalletUpdate } from "@/lib/wallet-events"

export function NotificationPrompt() {
  const [show, setShow] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkNotificationStatus = async () => {
      // Check if notifications are supported
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        return
      }

      // Check if user already granted or denied permission
      if (Notification.permission !== "default") {
        return
      }

      // Check if user already has a subscription
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: subscriptions } = await supabase.from("push_subscriptions").select("id").eq("user_id", user.id)

      if (subscriptions && subscriptions.length > 0) {
        return
      }

      // Show prompt after a short delay
      setTimeout(() => setShow(true), 3000)
    }

    checkNotificationStatus()
  }, [supabase])

  const handleSubscribe = async () => {
    setIsSubscribing(true)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        setShow(false)
        setIsSubscribing(false)
        return
      }

      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
            "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr4qBXYaKedaVGmWKyM9FHI",
        ),
      })

      // Save subscription to database
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const subscriptionJSON = subscription.toJSON()

      const { error: subError } = await supabase.from("push_subscriptions").insert({
        user_id: user.id,
        endpoint: subscriptionJSON.endpoint!,
        p256dh: subscriptionJSON.keys!.p256dh,
        auth: subscriptionJSON.keys!.auth,
      })

      if (subError) throw subError

      // Check if user already claimed the bonus
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("notification_bonus_claimed")
        .eq("user_id", user.id)
        .single()

      if (!profile?.notification_bonus_claimed) {
        // Award 5 coins bonus
        await addCoins(5)
        emitWalletUpdate()

        // Mark bonus as claimed
        await supabase.from("user_profiles").update({ notification_bonus_claimed: true }).eq("user_id", user.id)

        // Show success message
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🎉 Bonus reçu !", {
            body: "Vous avez reçu 5 coins pour avoir activé les notifications !",
            icon: "/icon-192.jpg",
          })
        }
      }

      setShow(false)
    } catch (error) {
      console.error("[v0] Error subscribing to notifications:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleDismiss = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Activer les notifications</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recevez des alertes quand votre monstre a besoin de vous ! 🎁 Bonus de 5 coins offert
            </p>
            <div className="flex gap-2">
              <Button onClick={handleSubscribe} disabled={isSubscribing} className="flex-1" size="sm">
                {isSubscribing ? "Activation..." : "Activer (+5 🪙)"}
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
