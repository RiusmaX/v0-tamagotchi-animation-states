import { createClient } from "@/lib/supabase/server"

export interface LoginStreakResult {
  streak: number
  coinsEarned: number
  isNewDay: boolean
  message: string
}

export async function checkAndUpdateLoginStreak(): Promise<LoginStreakResult | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      // Check if error is due to missing columns
      if (profileError.message?.includes("last_login_date")) {
        console.warn(
          "Login streak columns not found. Please run the migration script: scripts/004_add_login_streak.sql",
        )
        return null
      }
      throw profileError
    }

    if (!profile) return null

    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
    const lastLoginDate = profile.last_login_date
    const currentStreak = profile.login_streak || 0

    // If already logged in today, no reward
    if (lastLoginDate === today) {
      return {
        streak: currentStreak,
        coinsEarned: 0,
        isNewDay: false,
        message: "Vous avez déjà réclamé votre récompense aujourd'hui !",
      }
    }

    let newStreak = 0
    let coinsToAdd = 0
    let message = ""

    if (!lastLoginDate) {
      // First login ever
      newStreak = 1
      coinsToAdd = 1
      message = "Bienvenue ! Connectez-vous chaque jour pour gagner plus de pièces !"
    } else {
      const lastLogin = new Date(lastLoginDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastLogin.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day
        if (currentStreak === 7) {
          // Reset after completing 7-day streak
          newStreak = 1
          coinsToAdd = 1
          message = "Nouveau cycle ! Continuez votre série de connexions !"
        } else {
          newStreak = currentStreak + 1
          coinsToAdd = newStreak === 7 ? 5 : 1
          message =
            newStreak === 7
              ? "🎉 7 jours consécutifs ! Vous gagnez 5 pièces !"
              : `Jour ${newStreak} ! Continuez comme ça !`
        }
      } else if (diffDays >= 2) {
        // Streak broken (missed a day)
        newStreak = 1
        coinsToAdd = 1
        message = "Votre série a été réinitialisée. Recommencez dès aujourd'hui !"
      } else {
        // Same day or future date (shouldn't happen)
        return {
          streak: currentStreak,
          coinsEarned: 0,
          isNewDay: false,
          message: "Erreur de date détectée",
        }
      }
    }

    // Update user profile with new streak and coins
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        last_login_date: today,
        login_streak: newStreak,
        last_streak_reward_date: today,
        coins: (profile.coins || 0) + coinsToAdd,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating login streak:", updateError)
      return null
    }

    return {
      streak: newStreak,
      coinsEarned: coinsToAdd,
      isNewDay: true,
      message,
    }
  } catch (error) {
    console.error("Error in checkAndUpdateLoginStreak:", error)
    return null
  }
}
