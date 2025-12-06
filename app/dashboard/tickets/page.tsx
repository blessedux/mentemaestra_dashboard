import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TicketIcon } from "lucide-react"
import Link from "next/link"
import { TicketCard } from "@/components/tickets/ticket-card"

export default async function TicketsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all tickets for the client
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, websites(name)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  // Organize tickets by status
  const openTickets = tickets?.filter((t) => t.status === "open") || []
  const inProgressTickets = tickets?.filter((t) => t.status === "in-progress") || []
  const doneTickets = tickets?.filter((t) => t.status === "done") || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
          <p className="text-muted-foreground">Manage your support tickets and tasks</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tickets/new">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Link>
        </Button>
      </div>

      {tickets && tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TicketIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">No tickets yet</p>
            <Button asChild>
              <Link href="/dashboard/tickets/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Ticket
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Open Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Open</span>
                <span className="text-sm font-normal text-muted-foreground">{openTickets.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {openTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {openTickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No open tickets</p>
              )}
            </CardContent>
          </Card>

          {/* In Progress Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>In Progress</span>
                <span className="text-sm font-normal text-muted-foreground">{inProgressTickets.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inProgressTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {inProgressTickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tickets in progress</p>
              )}
            </CardContent>
          </Card>

          {/* Done Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Done</span>
                <span className="text-sm font-normal text-muted-foreground">{doneTickets.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doneTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {doneTickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No completed tickets</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
