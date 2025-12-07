"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { X, CheckCircle, Clock, AlertCircle, Circle, MessageSquare, Calendar, Globe } from "lucide-react"
import type { Ticket } from "@/lib/types/database"

export interface TicketWithWebsite extends Ticket {
  websites?: { name: string; url?: string } | null
}

interface TicketManagementTableProps {
  title?: string
  tickets?: TicketWithWebsite[]
  onStatusChange?: (ticketId: string, newStatus: Ticket["status"]) => void
  onTicketClick?: (ticket: TicketWithWebsite) => void
  className?: string
}

const defaultTickets: TicketWithWebsite[] = [
  {
    id: "1",
    client_id: "client-1",
    title: "Website performance issues on mobile",
    description: "Users reporting slow load times on mobile devices",
    status: "open",
    priority: "high",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    websites: { name: "Main Website", url: "https://example.com" },
  },
  {
    id: "2",
    client_id: "client-1",
    title: "Update contact form validation",
    description: "Need to add email validation to contact form",
    status: "in-progress",
    priority: "medium",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    websites: { name: "Main Website", url: "https://example.com" },
  },
  {
    id: "3",
    client_id: "client-1",
    title: "SEO optimization for blog section",
    description: "Improve meta tags and descriptions for blog posts",
    status: "done",
    priority: "low",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    websites: { name: "Blog Site", url: "https://blog.example.com" },
  },
  {
    id: "4",
    client_id: "client-1",
    title: "Fix broken links in footer",
    description: "Several footer links are returning 404 errors",
    status: "open",
    priority: "medium",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    client_id: "client-1",
    title: "Add new payment gateway integration",
    description: "Integrate Stripe payment gateway for checkout",
    status: "in-progress",
    priority: "high",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    websites: { name: "E-commerce Site", url: "https://shop.example.com" },
  },
]

export function TicketManagementTable({
  title = "Active Tickets",
  tickets: initialTickets = defaultTickets,
  onStatusChange,
  onTicketClick,
  className = "",
}: TicketManagementTableProps) {
  const [tickets, setTickets] = useState<TicketWithWebsite[]>(initialTickets || defaultTickets)
  const [hoveredTicket, setHoveredTicket] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<TicketWithWebsite | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Sync tickets when initialTickets prop changes
  useEffect(() => {
    if (initialTickets && initialTickets.length > 0) {
      setTickets(initialTickets)
    }
  }, [initialTickets])

  // Ensure tickets is always an array
  const displayTickets = tickets || []

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    if (onStatusChange) {
      onStatusChange(ticketId, newStatus)
    }

    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))
    )
  }

  const openTicketModal = (ticket: TicketWithWebsite) => {
    setSelectedTicket(ticket)
    if (onTicketClick) {
      onTicketClick(ticket)
    }
  }

  const closeTicketModal = () => {
    setSelectedTicket(null)
  }

  // Update selected ticket when tickets change (for real-time updates)
  useEffect(() => {
    if (selectedTicket) {
      const updatedTicket = displayTickets.find((t) => t.id === selectedTicket.id)
      if (updatedTicket) {
        setSelectedTicket(updatedTicket)
      }
    }
  }, [displayTickets, selectedTicket])

  const getPriorityIcon = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-1.5 border border-border/30">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        )
      case "medium":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center p-1.5 border border-border/30">
            <Clock className="w-4 h-4 text-white" />
          </div>
        )
      case "low":
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-1.5 border border-border/30">
            <Circle className="w-4 h-4 text-white" />
          </div>
        )
    }
  }

  const getPriorityBars = (priority: Ticket["priority"], status: Ticket["status"]) => {
    const priorityLevels = {
      high: 10,
      medium: 6,
      low: 3,
    }

    const filledBars = priorityLevels[priority]

    const getBarColor = (index: number) => {
      if (index >= filledBars) {
        return "bg-muted/40 border border-border/30"
      }

      switch (priority) {
        case "high":
          return status === "done" ? "bg-green-500/60" : "bg-red-500/60"
        case "medium":
          return status === "done" ? "bg-green-500/60" : "bg-yellow-500/60"
        case "low":
          return status === "done" ? "bg-green-500/60" : "bg-blue-500/60"
        default:
          return "bg-foreground/60"
      }
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-5 rounded-full transition-all duration-500 ${getBarColor(index)}`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-foreground min-w-[4rem] capitalize">{priority}</span>
      </div>
    )
  }

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 text-sm font-medium">Open</span>
          </div>
        )
      case "in-progress":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 text-sm font-medium">In Progress</span>
          </div>
        )
      case "done":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 text-sm font-medium">Done</span>
          </div>
        )
    }
  }

  const getStatusGradient = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "from-blue-500/10 to-transparent"
      case "in-progress":
        return "from-yellow-500/10 to-transparent"
      case "done":
        return "from-green-500/10 to-transparent"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  if (displayTickets.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative border border-border/30 rounded-2xl p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-xl font-medium text-foreground">{title}</h1>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tickets available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="relative border border-border/30 rounded-2xl p-6 bg-card min-h-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-xl font-medium text-foreground">{title}</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {displayTickets.filter((t) => t.status === "open").length} Open •{" "}
              {displayTickets.filter((t) => t.status === "in-progress").length} In Progress •{" "}
              {displayTickets.filter((t) => t.status === "done").length} Done
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div
          className="space-y-2"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Website</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Ticket Rows */}
          {displayTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets available</p>
            </div>
          ) : (
            displayTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              variants={{
                hidden: {
                  opacity: 0,
                  x: -25,
                  scale: 0.95,
                  filter: "blur(4px)",
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    mass: 0.6,
                  },
                },
              }}
              className="relative cursor-pointer"
              onMouseEnter={() => setHoveredTicket(ticket.id)}
              onMouseLeave={() => setHoveredTicket(null)}
              onClick={() => openTicketModal(ticket)}
            >
              <motion.div
                className="relative bg-muted/50 border border-border/50 rounded-xl p-4 overflow-hidden"
                whileHover={{
                  y: -1,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
              >
                {/* Status gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient(ticket.status)} pointer-events-none`}
                  style={{
                    backgroundSize: "30% 100%",
                    backgroundPosition: "right",
                    backgroundRepeat: "no-repeat",
                  }}
                />

                {/* Grid Content */}
                <div className="relative grid grid-cols-12 gap-4 items-center">
                  {/* Number */}
                  <div className="col-span-1">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-3 flex items-center gap-3">
                    {getPriorityIcon(ticket.priority)}
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground font-medium block truncate">{ticket.title}</span>
                      {ticket.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</span>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  <div className="col-span-2 flex items-center gap-3">
                    {ticket.websites ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-muted border border-border/30 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground truncate">{ticket.websites.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">No website</span>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground text-sm">{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">{getPriorityBars(ticket.priority, ticket.status)}</div>

                  {/* Status */}
                  <div className="col-span-2">{getStatusBadge(ticket.status)}</div>
                </div>
              </motion.div>
            </motion.div>
            ))
          )}
        </motion.div>

        {/* Ticket Management Overlay - Inside Card */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col rounded-2xl z-10 overflow-hidden"
            >
              {/* Header with Actions */}
              <div className="relative bg-gradient-to-r from-muted/50 to-transparent p-4 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {String(displayTickets.indexOf(selectedTicket) + 1).padStart(2, "0")}
                  </div>
                  {getPriorityIcon(selectedTicket.priority)}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedTicket.title}</h3>
                    {selectedTicket.websites && (
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedTicket.websites.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons in Header */}
                <div className="flex items-center gap-2">
                  {/* Status Change Buttons */}
                  {selectedTicket.status !== "open" && (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedTicket.id, "open")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Circle className="w-3 h-3" />
                      Open
                    </motion.button>
                  )}

                  {selectedTicket.status !== "in-progress" && (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedTicket.id, "in-progress")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Clock className="w-3 h-3" />
                      In Progress
                    </motion.button>
                  )}

                  {selectedTicket.status !== "done" && (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm transition-colors"
                      onClick={() => handleStatusChange(selectedTicket.id, "done")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Done
                    </motion.button>
                  )}

                  {/* Close Button */}
                  <motion.button
                    className="w-8 h-8 bg-background/80 hover:bg-background rounded-full flex items-center justify-center border border-border/50 ml-2"
                    onClick={closeTicketModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Ticket Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Priority */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Priority
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {getPriorityIcon(selectedTicket.priority)}
                      <span className="text-sm font-medium capitalize">{selectedTicket.priority}</span>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </label>
                    <div className="text-sm font-medium mt-1">{formatDate(selectedTicket.created_at)}</div>
                    <div className="text-xs text-muted-foreground mt-1">{getTimeAgo(selectedTicket.created_at)}</div>
                  </div>

                  {/* Status */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                  </div>
                </div>

                {/* Description */}
                {selectedTicket.description && (
                  <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                      Description
                    </label>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                )}

                {/* Priority Indicator */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Priority Level
                  </label>
                  {getPriorityBars(selectedTicket.priority, selectedTicket.status)}
                </div>

                {/* Activity Log Preview */}
                <div className="bg-muted/40 rounded-lg p-3 border border-border/30">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Recent Activity
                  </label>
                  <div className="font-mono text-xs space-y-1 max-h-24 overflow-y-auto">
                    <div className="text-green-400">
                      [{new Date(selectedTicket.updated_at).toLocaleTimeString()}] Status: {selectedTicket.status}
                    </div>
                    <div className="text-blue-400">
                      [{new Date(selectedTicket.created_at).toLocaleTimeString()}] Ticket created
                    </div>
                    <div className="text-muted-foreground">
                      Priority: {selectedTicket.priority} • Last updated: {getTimeAgo(selectedTicket.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

