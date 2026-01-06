"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import { PrivyWrapper } from "@/components/auth/privy-wrapper"

function LoginPageContent() {
  const router = useRouter()
  const { ready, authenticated, login } = usePrivy()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (ready && authenticated) {
      router.replace("/dashboard")
    }
  }, [ready, authenticated, router])

  // Auto-trigger login modal when page loads and user is not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        login().catch((error: unknown) => {
          console.error("Login error:", error)
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [ready, authenticated, login])

  if (authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Opening login...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <PrivyWrapper>
      <LoginPageContent />
    </PrivyWrapper>
  )
}
