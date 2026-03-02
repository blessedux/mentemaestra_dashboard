"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Spinner } from "@/components/ui/spinner"
import { PrivyWrapper } from "@/components/auth/privy-wrapper"

function LoginPageContent() {
  const router = useRouter()
  const { ready, authenticated, login } = usePrivy()

  useEffect(() => {
    // Redirect when already authenticated: go to projects to select org, or dashboard if one is selected
    if (ready && authenticated) {
      const selectedProjectId = typeof window !== "undefined" ? localStorage.getItem("selectedProjectId") : null
      if (selectedProjectId) {
        router.replace("/dashboard")
      } else {
        router.replace("/projects")
      }
    }
  }, [ready, authenticated, router])

  // Auto-trigger login modal when page loads and user is not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      const timer = setTimeout(() => {
        Promise.resolve(login()).catch((error: unknown) => {
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
          <Spinner size={32} />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
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
