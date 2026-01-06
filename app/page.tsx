"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { GradientBackground } from "@/components/ui/gradient-background"
import { PrivyWrapper } from "@/components/auth/privy-wrapper"
import { cn } from "@/lib/utils"
import { ChevronRight, Loader2 } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function HomePageContent() {
  const router = useRouter()
  const { ready, authenticated, login, user } = usePrivy()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/dashboard")
    }
  }, [ready, authenticated, router])

  const handleAuth = async () => {
    if (isLoggingIn) return
    
    setIsLoggingIn(true)
    try {
      await login()
    } catch (error) {
      console.error("Auth error:", error)
      // Show user-friendly error message
      alert("Failed to start login. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Show loading state while checking authentication or redirecting
  if (!ready || authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {authenticated ? "Redirecting to dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GradientBackground />
      <main className="relative z-10">
        <section>
          <div className="py-16 md:pb-20 lg:pb-24 lg:pt-48">
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-4xl md:text-5xl lg:mt-12 xl:text-6xl">
                  Build 10x Faster with MenteMaestra
                </h1>
                <p className="mt-6 max-w-2xl text-balance text-base md:text-lg">
                  Your comprehensive client dashboard for analytics, reports, and project management.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button
                    onClick={handleAuth}
                    disabled={isLoggingIn || !ready}
                    size="lg"
                    className="h-12 rounded-full pl-5 pr-3 text-base">
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="text-nowrap">Opening login...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-nowrap">Start Building</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5">
                    <Link href="#features">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="aspect-[2/3] absolute inset-1 overflow-hidden rounded-3xl border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <div className="size-full bg-gradient-to-br from-primary/20 to-primary/5 opacity-50 dark:opacity-35 dark:lg:opacity-75" />
            </div>
          </div>
        </section>
        <section className="bg-background/50 pb-2 backdrop-blur-sm">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-32 md:border-r md:pr-4">
                <p className="text-end text-xs md:text-sm">Powering the best teams</p>
              </div>
              <div className="relative py-4 md:w-[calc(100%-8rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={64}>
                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nvidia.svg"
                      alt="Nvidia Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-3 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/column.svg"
                      alt="Column Logo"
                      height="12"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-3 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/github.svg"
                      alt="GitHub Logo"
                      height="12"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nike.svg"
                      alt="Nike Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                      alt="Lemon Squeezy Logo"
                      height="16"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-3 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/laravel.svg"
                      alt="Laravel Logo"
                      height="12"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lilly.svg"
                      alt="Lilly Logo"
                      height="20"
                      width="auto"
                    />
                  </div>
                  <div className="flex">
                    <img
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/openai.svg"
                      alt="OpenAI Logo"
                      height="20"
                      width="auto"
                    />
                  </div>
                </InfiniteSlider>

                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-12"></div>
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-12"></div>
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-12"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-12"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <PrivyWrapper>
      <HomePageContent />
    </PrivyWrapper>
  )
}
