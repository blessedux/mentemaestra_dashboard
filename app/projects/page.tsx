"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { OnboardingDialog } from "@/components/projects/onboarding-dialog"
import type { Website } from "@/lib/types/database"

export default function ProjectsPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchProjects() {
      // NO AUTH - Fetch all websites without user filter
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        // .eq("client_id", user.id) // Commented out for development
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
      } else {
        setWebsites(data || [])
      }
      setIsLoading(false)
    }

    fetchProjects()
  }, [supabase, router])

  const handleProjectSelect = (projectId: string) => {
    // Store selected project in localStorage
    localStorage.setItem("selectedProjectId", projectId)
    setSelectedProjectId(projectId)

    // Check if onboarding has been shown for this project
    const onboardingKey = `onboarding_completed_${projectId}`
    const hasSeenOnboarding = localStorage.getItem(onboardingKey)

    if (!hasSeenOnboarding) {
      // Show onboarding dialog
      setShowOnboarding(true)
    } else {
      // Redirect to dashboard
      router.push("/dashboard")
    }
  }

  const handleOnboardingComplete = () => {
    if (selectedProjectId) {
      // Mark onboarding as completed for this project
      const onboardingKey = `onboarding_completed_${selectedProjectId}`
      localStorage.setItem(onboardingKey, "true")
    }
    setShowOnboarding(false)
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Select Your Project</h1>
              <p className="text-sm text-muted-foreground">
                Choose a project to manage from your assigned projects
              </p>
            </div>

            {websites.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Projects Available</CardTitle>
                  <CardDescription>
                    You don&apos;t have any projects assigned yet. Please contact your administrator.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {websites.map((website) => (
                  <Card
                    key={website.id}
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                    onClick={() => handleProjectSelect(website.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{website.name}</CardTitle>
                          <CardDescription className="text-xs mt-1 truncate">
                            {website.url}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Select Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showOnboarding && selectedProjectId && (
        <OnboardingDialog
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
          projectName={websites.find((w) => w.id === selectedProjectId)?.name || "Project"}
        />
      )}
    </>
  )
}
