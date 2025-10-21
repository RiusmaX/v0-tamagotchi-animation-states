import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - auth routes (login, sign-up, etc.)
     * - public routes (landing page, pricing)
     * - api/webhooks (webhook endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|auth|pricing|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)(?!^/$).*)",
  ],
}
