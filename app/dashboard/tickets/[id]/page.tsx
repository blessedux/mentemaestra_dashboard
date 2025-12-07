"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TicketDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [ticket, setTicket] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // NO AUTH - Fetch ticket without user filter
      setUserId("dev-user-id") // Dummy ID for development

      // Fetch ticket
      const { data: ticketData } = await supabase
        .from("tickets")
        .select("*, websites(name, url)")
        .eq("id", id)
        // .eq("client_id", user.id) // Commented out for development
        .single()

      setTicket(ticketData)

      // Fetch comments
      const { data: commentsData } = await supabase
        .from("ticket_comments")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true })

      setComments(commentsData || [])
      setIsLoading(false)
    }

    fetchData()
  }, [id, supabase])

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return

    const { error } = await supabase.from("tickets").update({ status: newStatus }).eq("id", ticket.id)

    if (!error) {
      setTicket({ ...ticket, status: newStatus })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !userId) return

    setIsSubmitting(true)

    const { data, error } = await supabase
      .from("ticket_comments")
      .insert({
        ticket_id: id,
        user_id: userId,
        comment: newComment,
      })
      .select()
      .single()

    if (!error && data) {
      setComments([...comments, data])
      setNewComment("")
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return <div className="text-center py-12">Ticket not found</div>
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    open: "default",
    "in-progress": "secondary",
    done: "outline",
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/tickets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <Badge variant="outline" className={`${priorityColors[ticket.priority]} capitalize shrink-0`}>
                {ticket.priority} Priority
              </Badge>
            </div>
            <CardDescription>
              Created on{" "}
              {new Date(ticket.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {ticket.websites?.name && ` • ${ticket.websites.name}`}
            </CardDescription>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {ticket.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-primary/20 pl-4 py-2">
                  <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(comment.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
