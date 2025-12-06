"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2, Check } from "lucide-react"

export default function SettingsPage() {
  const [client, setClient] = useState<any>(null)
  const [websites, setWebsites] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Form states
  const [companyName, setCompanyName] = useState("")
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("")
  const [newWebsiteName, setNewWebsiteName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberName, setNewMemberName] = useState("")

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Fetch client data
    const { data: clientData } = await supabase.from("clients").select("*").eq("id", user.id).single()
    setClient(clientData)
    setCompanyName(clientData?.company_name || "")

    // Fetch websites
    const { data: websitesData } = await supabase.from("websites").select("*").eq("client_id", user.id)
    setWebsites(websitesData || [])

    // Fetch team members
    const { data: teamData } = await supabase.from("team_members").select("*").eq("client_id", user.id)
    setTeamMembers(teamData || [])

    setIsLoading(false)
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("clients").update({ company_name: companyName }).eq("id", user.id)

    if (!error) {
      setSuccessMessage("Company information updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }

    setIsSaving(false)
  }

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("websites")
      .insert({
        client_id: user.id,
        url: newWebsiteUrl,
        name: newWebsiteName,
      })
      .select()
      .single()

    if (!error && data) {
      setWebsites([...websites, data])
      setNewWebsiteUrl("")
      setNewWebsiteName("")
      setSuccessMessage("Website added successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }

    setIsSaving(false)
  }

  const handleRemoveWebsite = async (id: string) => {
    const { error } = await supabase.from("websites").delete().eq("id", id)

    if (!error) {
      setWebsites(websites.filter((w) => w.id !== id))
      setSuccessMessage("Website removed successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        client_id: user.id,
        email: newMemberEmail,
        name: newMemberName,
        role: "member",
      })
      .select()
      .single()

    if (!error && data) {
      setTeamMembers([...teamMembers, data])
      setNewMemberEmail("")
      setNewMemberName("")
      setSuccessMessage("Team member added successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }

    setIsSaving(false)
  }

  const handleRemoveTeamMember = async (id: string) => {
    const { error } = await supabase.from("team_members").delete().eq("id", id)

    if (!error) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
      setSuccessMessage("Team member removed successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
          <Check className="h-4 w-4" />
          {successMessage}
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Your current plan and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="default" className="text-sm capitalize mb-2">
                    {client?.subscription_tier}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {client?.subscription_tier === "basic" && "Access to core features"}
                    {client?.subscription_tier === "premium" && "Access to advanced features and priority support"}
                    {client?.subscription_tier === "enterprise" && "Full access with dedicated support"}
                  </p>
                </div>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authorized Websites</CardTitle>
              <CardDescription>Manage the websites connected to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {websites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No websites added yet</p>
                ) : (
                  websites.map((website) => (
                    <div key={website.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{website.name}</p>
                        <p className="text-sm text-muted-foreground">{website.url}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWebsite(website.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <form onSubmit={handleAddWebsite} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website-name">Website Name</Label>
                    <Input
                      id="website-name"
                      placeholder="My Website"
                      value={newWebsiteName}
                      onChange={(e) => setNewWebsiteName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <Input
                      id="website-url"
                      type="url"
                      placeholder="https://example.com"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Plus className="h-4 w-4 mr-2" />
                  Add Website
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Invite team members to collaborate {client?.subscription_tier === "basic" && "(Premium feature)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {client?.subscription_tier === "basic" ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">Team members are only available on Premium plans</p>
                  <Button variant="outline">Upgrade to Premium</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {teamMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No team members added yet</p>
                    ) : (
                      teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {member.role}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  <form onSubmit={handleAddTeamMember} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="member-name">Name</Label>
                        <Input
                          id="member-name"
                          placeholder="John Doe"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="member-email">Email</Label>
                        <Input
                          id="member-email"
                          type="email"
                          placeholder="john@example.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Team Member
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No payment method on file</p>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No billing history available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
