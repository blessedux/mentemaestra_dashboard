"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { ReactNode, useEffect, useState } from "react"

interface PrivyAuthProviderProps {
  children: ReactNode
}

export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  const [mounted, setMounted] = useState(false)
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  // Only render PrivyProvider on client side after mount
  // This prevents SSR issues with WalletConnect/Solana imports
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!appId) {
    if (typeof window !== "undefined") {
      console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file.")
    }
    // Return children without PrivyProvider in development to avoid breaking the app
    // In production, you should ensure the appId is set
    return <>{children}</>
  }

  // Don't render PrivyProvider during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "google"],
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
          logo: "/icon.svg",
        },
        // Completely disable all wallet features - only use email/Google auth
        embeddedWallets: {
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "off",
          },
        },
        // Disable all external wallet connections
        externalWallets: {},
      }}
    >
      {children}
    </PrivyProvider>
  )
}
