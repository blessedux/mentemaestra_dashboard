"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TicketManagementTable, type TicketWithWebsite } from "@/components/ui/ticket-management-table"
import type { Ticket } from "@/lib/types/database"

interface TicketTableWrapperProps {
  initialTickets: TicketWithWebsite[]
}

export function TicketTableWrapper({ initialTickets }: TicketTableWrapperProps) {
  const [tickets, setTickets] = useState<TicketWithWebsite[]>(initialTickets)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Sync tickets when initialTickets changes
  useEffect(() => {
    setTickets(initialTickets)
  }, [initialTickets])

  const handleStatusChange = async (ticketId: string, newStatus: Ticket["status"]) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", ticketId)

      if (error) {
        console.error("Error updating ticket status:", error)
        return
      }

      // Update local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() } : ticket
        )
      )

      // Refresh the page to get updated data
      router.refresh()
    } catch (error) {
      console.error("Error updating ticket:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <TicketManagementTable
      title="Active Tickets"
      tickets={tickets}
      onStatusChange={handleStatusChange}
    />
  )
}

