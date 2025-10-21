import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key for admin operations
// This bypasses Row Level Security (RLS) and should only be used in secure server contexts
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for admin client")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
