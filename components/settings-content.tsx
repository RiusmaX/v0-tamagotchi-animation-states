"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Coins, Sparkles, Bell, BellOff } from "lucide-react"
import Link from "next/link"
import { addCoins } from "@/lib/currency"
import { WalletDisplay } from "@/components/wallet-display"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { emitWalletUpdate } from "@/lib/wallet-events"

export function SettingsContent() {
  const [isAdding, setIsAdding] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<"unsupported" | "default" | "granted" | "denied">(
    "default",
  )
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkNotificationStatus()
  }, [])

  const checkNotificationStatus = async () => {
    // Check if notifications are supported
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setNotificationStatus("unsupported")
      return
    }

    setNotificationStatus(Notification.permission as "default" | "granted" | "denied")

    // Check if user has an active subscription
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: subscriptions } = await supabase.from("push_subscriptions").select("id").eq("user_id", user.id)

    setIsSubscribed(subscriptions && subscriptions.length > 0)
  }

  const handleAddCoins = async () => {
    setIsAdding(true)
    try {
      await addCoins(10)
      router.refresh()
      setTimeout(() => {
        setIsAdding(false)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error adding coins:", error)
      setIsAdding(false)
    }
  }

  const handleToggleNotifications = async () => {
    setIsTogglingNotifications(true)

    try {
      if (isSubscribed) {
        // Unsubscribe
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        await supabase.from("push_subscriptions").delete().eq("user_id", user.id)

        // Unsubscribe from push manager
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await subscription.unsubscribe()
        }

        setIsSubscribed(false)
        setNotificationStatus("default")
      } else {
        // Subscribe
        const permission = await Notification.requestPermission()

        if (permission !== "granted") {
          setNotificationStatus(permission as "denied")
          setIsTogglingNotifications(false)
          return
        }

        setNotificationStatus("granted")

        const registration = await navigator.serviceWorker.register("/sw", {
          scope: "/",
        })
        await navigator.serviceWorker.ready

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
              "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr4qBXYaKedaVGmWKyM9FHI",
          ),
        })

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const subscriptionJSON = subscription.toJSON()

        await supabase.from("push_subscriptions").insert({
          user_id: user.id,
          endpoint: subscriptionJSON.endpoint!,
          p256dh: subscriptionJSON.keys!.p256dh,
          auth: subscriptionJSON.keys!.auth,
        })

        // Check if user already claimed the bonus
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("notification_bonus_claimed")
          .eq("user_id", user.id)
          .single()

        if (!profile?.notification_bonus_claimed) {
          await addCoins(5)
          emitWalletUpdate()

          await supabase.from("user_profiles").update({ notification_bonus_claimed: true }).eq("user_id", user.id)

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("🎉 Bonus reçu !", {
              body: "Vous avez reçu 5 coins pour avoir activé les notifications !",
              icon: "/icon-192.jpg",
            })
          }
        }

        setIsSubscribed(true)
      }
    } catch (error) {
      console.error("[v0] Error toggling notifications:", error)
    } finally {
      setIsTogglingNotifications(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 mt-8">
        <Link href="/profile">
          <Button variant="outline" size="lg" className="tracking-wider bg-transparent">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </Button>
        </Link>
        <WalletDisplay />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans">
          ⚙️ Paramètres
        </h1>
        <p className="text-muted-foreground text-xl font-medium">Gérez votre compte et vos préférences</p>
      </div>

      <div className="space-y-6">
        <Card className="p-8 shadow-xl border-4 border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border-2 border-blue-400">
              {isSubscribed ? (
                <Bell className="h-8 w-8 text-blue-600" />
              ) : (
                <BellOff className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Notifications Push</h2>
              <p className="text-muted-foreground mb-2">Recevez des alertes quand votre monstre a besoin de vous.</p>
              {notificationStatus === "granted" && isSubscribed && (
                <p className="text-sm text-green-600 font-medium">✓ Notifications activées</p>
              )}
              {notificationStatus === "denied" && (
                <p className="text-sm text-red-600 font-medium">
                  ✗ Notifications refusées. Modifiez les paramètres de votre navigateur pour les activer.
                </p>
              )}
              {notificationStatus === "unsupported" && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠ Les notifications ne sont pas supportées par votre navigateur.
                </p>
              )}
            </div>
          </div>
          {notificationStatus !== "unsupported" && notificationStatus !== "denied" && (
            <Button
              onClick={handleToggleNotifications}
              disabled={isTogglingNotifications}
              size="lg"
              variant={isSubscribed ? "outline" : "default"}
              className={
                isSubscribed
                  ? "w-full"
                  : "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
              }
            >
              {isTogglingNotifications ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  {isSubscribed ? "Désactivation..." : "Activation..."}
                </>
              ) : isSubscribed ? (
                <>
                  <BellOff className="mr-2 h-5 w-5" />
                  Désactiver les notifications
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-5 w-5" />
                  Activer les notifications (+5 🪙)
                </>
              )}
            </Button>
          )}
        </Card>

        <Card className="p-8 shadow-xl border-4 border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl border-2 border-yellow-400">
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Portefeuille</h2>
              <p className="text-muted-foreground mb-4">
                Gérez vos coins et vos achats. Les coins sont gagnés en prenant soin de vos monstres.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-400">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Mode Triche</h2>
              <p className="text-muted-foreground mb-4">
                Besoin de coins rapidement ? Utilisez ce bouton pour ajouter 10 coins instantanément !
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddCoins}
            disabled={isAdding}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-6"
          >
            {isAdding ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-5 w-5" />
                Ajouter +10 Coins
              </>
            )}
          </Button>
        </Card>

        <Card className="p-8 shadow-xl border-4 border-border bg-card/95 backdrop-blur-sm">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">💡 Astuce</p>
            <p className="mt-2">
              Vous pouvez gagner des coins en effectuant des actions avec vos monstres. Chaque action rapporte 1 coin !
            </p>
          </div>
        </Card>
      </div>
    </>
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
