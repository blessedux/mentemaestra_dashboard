import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === "your-project-url-here") {
    throw new Error(
      `Missing or invalid NEXT_PUBLIC_SUPABASE_URL environment variable.\n\n` +
      `Please set it in your .env.local file with your Supabase project URL.\n` +
      `Example: https://your-project-id.supabase.co\n\n` +
      `Get your URL from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  if (!supabaseKey || supabaseKey === "your-anon-key-here") {
    throw new Error(
      `Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.\n\n` +
      `Please set it in your .env.local file with your Supabase anon/public key.\n\n` +
      `Get your key from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  })
}
