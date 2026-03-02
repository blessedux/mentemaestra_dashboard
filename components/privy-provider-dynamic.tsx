"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"

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
          <Spinner size={32} />
          <p className="text-sm text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    ),
  }
)

export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const isProduction = process.env.NODE_ENV === "production"

  if (!appId) {
    if (typeof window !== "undefined") {
      console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file.")
    }
    // In production, show a clear error so auth is not silently broken
    if (isProduction) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">Authentication not configured</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_PRIVY_APP_ID</code> is missing.
            Add it in your production environment (e.g. Vercel project env vars) and ensure your
            production domain is allowed in the Privy Dashboard (Configuration → App settings → Domains and Advanced).
          </p>
        </div>
      )
    }
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
          logo: "/MMLOGOPINK1.png",
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

