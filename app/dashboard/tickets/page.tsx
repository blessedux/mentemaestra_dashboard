import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, TicketIcon } from "lucide-react"
import Link from "next/link"
import { TicketTableWrapper } from "@/components/tickets/ticket-table-wrapper"
import type { TicketWithWebsite } from "@/components/ui/ticket-management-table"

export default async function TicketsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMPORARILY BYPASSING AUTH FOR DEVELOPMENT
  // if (!user) return null

  // Fetch all tickets for the client
  // TEMPORARILY: Fetch all tickets without filtering by user
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, websites(name, url)")
    // .eq("client_id", user.id) // Commented out for development
    .order("created_at", { ascending: false })

  // Transform tickets to match the expected format
  const formattedTickets: TicketWithWebsite[] =
    tickets?.map((ticket) => ({
      ...ticket,
      websites: ticket.websites ? { name: ticket.websites.name, url: ticket.websites.url } : null,
    })) || []

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

      {formattedTickets.length === 0 ? (
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
        <TicketTableWrapper initialTickets={formattedTickets} />
      )}
    </div>
  )
}
