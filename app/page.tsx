import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">MenteMaestra</h1>
        <p className="text-xl text-muted-foreground">
          Your comprehensive client dashboard for analytics, reports, and project management
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
