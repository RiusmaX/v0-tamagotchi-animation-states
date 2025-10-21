import { NextResponse } from "next/server"
import { checkAndUpdateLoginStreak } from "@/lib/login-streak"

export async function POST() {
  try {
    const result = await checkAndUpdateLoginStreak()

    if (!result) {
      return NextResponse.json(
        {
          streak: 0,
          coinsEarned: 0,
          isNewDay: false,
          message: "Login streak not available",
        },
        { status: 200 },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in check-login-streak API:", error)
    return NextResponse.json(
      {
        streak: 0,
        coinsEarned: 0,
        isNewDay: false,
        message: "Login streak temporarily unavailable",
      },
      { status: 200 },
    )
  }
}
