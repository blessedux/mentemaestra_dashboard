"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types/database"
import Link from "next/link"

interface TicketCardProps {
  ticket: Ticket & { websites?: { name: string } }
}

export function TicketCard({ ticket }: TicketCardProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">{ticket.title}</h4>
              <Badge variant="outline" className={`${priorityColors[ticket.priority]} shrink-0 text-xs capitalize`}>
                {ticket.priority}
              </Badge>
            </div>
            {ticket.description && <p className="text-xs text-muted-foreground line-clamp-2">{ticket.description}</p>}
            {ticket.websites?.name && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Site:</span> {ticket.websites.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(ticket.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
