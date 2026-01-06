"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { ready, authenticated, user } = usePrivy()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only redirect if Privy is ready and user is not authenticated
    if (ready && !authenticated && !isRedirecting) {
      setIsRedirecting(true)
      // Use replace to avoid adding to history stack
      router.replace("/")
    }
  }, [ready, authenticated, router, isRedirecting])

  // Show loading state while Privy initializes
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

  // Show loading state while redirecting
  if (!authenticated || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}
