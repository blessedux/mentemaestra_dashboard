"use client"

import { usePrivy } from "@privy-io/react-auth"
import { ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface PrivyWrapperProps {
  children: ReactNode
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
  const { ready } = usePrivy()
  
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
