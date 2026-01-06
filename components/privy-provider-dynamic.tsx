"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"

interface PrivyAuthProviderProps {
  children: ReactNode
}

// Dynamically import PrivyProvider with SSR disabled
// This prevents WalletConnect/Solana modules from being loaded on the server
const PrivyProvider = dynamic(
  () => import("@privy-io/react-auth").then((mod) => mod.PrivyProvider),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    ),
  }
)

export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!appId) {
    if (typeof window !== "undefined") {
      console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file.")
    }
    // Return children without PrivyProvider in development to avoid breaking the app
    // In production, you should ensure the appId is set
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

