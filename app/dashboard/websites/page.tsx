"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KanbanBoard } from "@/components/ui/kanban-board"
import { Loader2, Globe, Calendar, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Website, Ticket } from "@/lib/types/database"
interface WebsiteWithTickets extends Website {
  tickets: Ticket[]
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteWithTickets[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null)
  const supabase = createClient()

  // Hardcoded example project for development/mockup
  const getExampleProject = (): WebsiteWithTickets => {
    const exampleWebsiteId = "example-project-001"
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    return {
      id: exampleWebsiteId,
      client_id: "example-client",
      url: "https://example-company.com",
      name: "Example Company Website",
      version: "2.1.3",
      created_at: lastWeek.toISOString(),
      updated_at: yesterday.toISOString(),
      tickets: [
        {
          id: "ticket-001",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Update homepage hero section",
          description: "Redesign the hero section with new branding and improved CTA buttons. Include responsive design updates.",
          status: "in-progress",
          priority: "high",
          requested_by: "Marketing Team",
          created_at: twoDaysAgo.toISOString(),
          updated_at: yesterday.toISOString(),
        },
        {
          id: "ticket-002",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Fix mobile navigation menu",
          description: "The mobile menu is not closing properly on iOS devices. Need to investigate and fix the touch event handlers.",
          status: "open",
          priority: "medium",
          requested_by: "Support Team",
          created_at: yesterday.toISOString(),
          updated_at: yesterday.toISOString(),
        },
        {
          id: "ticket-003",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Add new product showcase section",
          description: "Create a new section to showcase featured products with image galleries and quick view functionality.",
          status: "open",
          priority: "low",
          requested_by: "Product Team",
          created_at: lastWeek.toISOString(),
          updated_at: lastWeek.toISOString(),
        },
        {
          id: "ticket-004",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Optimize page load performance",
          description: "Page load time has increased. Need to optimize images, implement lazy loading, and review third-party scripts.",
          status: "done",
          priority: "high",
          requested_by: "DevOps Team",
          created_at: lastWeek.toISOString(),
          updated_at: twoDaysAgo.toISOString(),
        },
        {
          id: "ticket-005",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Update contact form validation",
          description: "Add better validation messages and improve error handling for the contact form submission.",
          status: "in-progress",
          priority: "medium",
          requested_by: "UX Team",
          created_at: yesterday.toISOString(),
          updated_at: now.toISOString(),
        },
        {
          id: "ticket-006",
          client_id: "example-client",
          website_id: exampleWebsiteId,
          title: "Implement dark mode toggle",
          description: "Add a dark mode feature with user preference persistence and smooth theme transitions.",
          status: "open",
          priority: "low",
          requested_by: "Design Team",
          created_at: twoDaysAgo.toISOString(),
          updated_at: twoDaysAgo.toISOString(),
        },
      ],
    }
  }

  useEffect(() => {
    async function fetchWebsites() {
      setIsLoading(true)
      try {
        // Always include the example project
        const exampleProject = getExampleProject()
        const allWebsites: WebsiteWithTickets[] = [exampleProject]

        // Fetch all websites from database
        const { data: websitesData, error: websitesError } = await supabase
          .from("websites")
          .select("*")
          .order("created_at", { ascending: false })

        if (websitesError) {
          console.error("Error fetching websites:", websitesError)
        } else if (websitesData && websitesData.length > 0) {
          // Fetch all tickets with website_id
          const { data: ticketsData, error: ticketsError } = await supabase
            .from("tickets")
            .select("*")
            .not("website_id", "is", null)
            .order("created_at", { ascending: false })

          if (ticketsError) {
            console.error("Error fetching tickets:", ticketsError)
          }

          // Group tickets by website_id
          const ticketsByWebsite = new Map<string, Ticket[]>()
          ticketsData?.forEach((ticket) => {
            if (ticket.website_id) {
              if (!ticketsByWebsite.has(ticket.website_id)) {
                ticketsByWebsite.set(ticket.website_id, [])
              }
              ticketsByWebsite.get(ticket.website_id)?.push(ticket as Ticket)
            }
          })

          // Combine websites with their tickets (excluding example project ID)
          const dbWebsitesWithTickets: WebsiteWithTickets[] = websitesData
            .filter((w) => w.id !== exampleProject.id) // Don't duplicate example project
            .map((website) => ({
              ...website,
              version: website.version || "1.0.0", // Default version if not set
              updated_at: website.updated_at || website.created_at,
              tickets: ticketsByWebsite.get(website.id) || [],
            }))

          allWebsites.push(...dbWebsitesWithTickets)
        }

        setWebsites(allWebsites)

        // Set first website (example project) as selected if available
        if (allWebsites.length > 0 && !selectedWebsiteId) {
          setSelectedWebsiteId(allWebsites[0].id)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Even on error, show the example project
        setWebsites([getExampleProject()])
        if (!selectedWebsiteId) {
          setSelectedWebsiteId("example-project-001")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebsites()
  }, [supabase, selectedWebsiteId])

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (websites.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
          <p className="text-muted-foreground">Manage your websites and their tasks</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">No websites yet</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
        <p className="text-muted-foreground">Manage your websites and their tasks</p>
      </div>

      <Tabs value={selectedWebsiteId || undefined} onValueChange={setSelectedWebsiteId} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-1">
          {websites.map((website) => (
            <TabsTrigger
              key={website.id}
              value={website.id}
              className="flex flex-col items-start gap-1 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="font-medium">{website.name}</span>
              </div>
              <span className="text-xs opacity-70 truncate max-w-[200px]">{website.url}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {websites.map((website) => (
          <TabsContent key={website.id} value={website.id} className="space-y-6 mt-6">
            {/* Website Info */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Version
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{website.version || "1.0.0"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last Update
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {new Date(website.updated_at || website.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(website.updated_at || website.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    URL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block"
                  >
                    {website.url}
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Tasks & Tickets</h3>
              {website.tickets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground text-center">No tickets for this website yet</p>
                  </CardContent>
                </Card>
              ) : (
                <KanbanBoard
                  tickets={website.tickets}
                  onStatusChange={async (ticketId, newStatus) => {
                    // Check if it's the example project (hardcoded)
                    if (website.id === "example-project-001") {
                      // Just update local state for example project
                      setWebsites((prev) =>
                        prev.map((w) =>
                          w.id === website.id
                            ? {
                                ...w,
                                tickets: w.tickets.map((t) =>
                                  t.id === ticketId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t
                                ),
                              }
                            : w
                        )
                      )
                    } else {
                      // Update ticket status in database for real projects
                      const { error } = await supabase
                        .from("tickets")
                        .update({ status: newStatus, updated_at: new Date().toISOString() })
                        .eq("id", ticketId)

                      if (!error) {
                        // Update local state
                        setWebsites((prev) =>
                          prev.map((w) => ({
                            ...w,
                            tickets: w.tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
                          }))
                        )
                      }
                    }
                  }}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
