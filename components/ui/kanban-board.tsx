"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Ticket } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { User, Clock } from "lucide-react"
import Link from "next/link"

interface KanbanBoardProps {
  tickets: Ticket[]
  onStatusChange?: (ticketId: string, newStatus: Ticket["status"]) => void
}

interface TicketWithRequester extends Ticket {
  requested_by_name?: string
}

const statusColumns = [
  { id: "open", label: "Open", color: "bg-blue-500/10 border-blue-500/20" },
  { id: "in-progress", label: "In Progress", color: "bg-yellow-500/10 border-yellow-500/20" },
  { id: "done", label: "Done", color: "bg-green-500/10 border-green-500/20" },
] as const

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export function KanbanBoard({ tickets, onStatusChange }: KanbanBoardProps) {
  const getTicketsByStatus = (status: Ticket["status"]) => {
    return tickets.filter((ticket) => ticket.status === status)
  }

  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {statusColumns.map((column) => {
        const columnTickets = getTicketsByStatus(column.id as Ticket["status"])

        return (
          <div key={column.id} className="flex flex-col">
            <div className={cn("mb-4 px-3 py-2 rounded-lg border", column.color)}>
              <h3 className="font-semibold text-sm">
                {column.label} <span className="text-muted-foreground">({columnTickets.length})</span>
              </h3>
            </div>
            <div className="flex-1 space-y-3 min-h-[200px]">
              {columnTickets.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  No tickets
                </div>
              ) : (
                columnTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-medium line-clamp-2">{ticket.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className={cn("shrink-0 text-xs capitalize", priorityColors[ticket.priority])}
                          >
                            {ticket.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        {ticket.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{ticket.description}</p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          {ticket.requested_by && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials((ticket as TicketWithRequester).requested_by_name || ticket.requested_by)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground truncate">
                                {(ticket as TicketWithRequester).requested_by_name || ticket.requested_by}
                              </span>
                            </div>
                          )}
                          {!ticket.requested_by && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>Unknown</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
