"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { useSelectedProject } from "@/lib/hooks/use-selected-project"
import { createClient } from "@/lib/supabase/client"
import type { SEODataSource, SEODataSourceType } from "@/lib/types/seo"

export default function SEOSettingsPage() {
  const { selectedProjectId } = useSelectedProject()
  const [dataSources, setDataSources] = useState<SEODataSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSource, setNewSource] = useState<{
    source_type: SEODataSourceType
    source_name: string
    credentials: Record<string, string>
    sync_frequency: "hourly" | "daily" | "weekly"
  }>({
    source_type: "google_search_console",
    source_name: "",
    credentials: {},
    sync_frequency: "daily",
  })
  const supabase = createClient()

  useEffect(() => {
    if (selectedProjectId) {
      fetchDataSources()
    }
  }, [selectedProjectId])

  const fetchDataSources = async () => {
    if (!selectedProjectId) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("seo_data_sources")
        .select("*")
        .eq("website_id", selectedProjectId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching data sources:", error)
      } else {
        setDataSources(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSource = async () => {
    if (!selectedProjectId) return

    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("seo_data_sources")
        .insert({
          website_id: selectedProjectId,
          source_type: newSource.source_type,
          source_name: newSource.source_name || getSourceDisplayName(newSource.source_type),
          credentials: newSource.credentials,
          sync_frequency: newSource.sync_frequency,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding data source:", error)
        alert("Failed to add data source: " + error.message)
      } else {
        setDataSources([...dataSources, data])
        setShowAddForm(false)
        setNewSource({
          source_type: "google_search_console",
          source_name: "",
          credentials: {},
          sync_frequency: "daily",
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("seo_data_sources")
        .update({ is_active: !isActive })
        .eq("id", id)

      if (error) {
        console.error("Error updating data source:", error)
      } else {
        setDataSources(dataSources.map((ds) => (ds.id === id ? { ...ds, is_active: !isActive } : ds)))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this data source?")) return

    try {
      const { error } = await supabase.from("seo_data_sources").delete().eq("id", id)

      if (error) {
        console.error("Error deleting data source:", error)
      } else {
        setDataSources(dataSources.filter((ds) => ds.id !== id))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const getSourceDisplayName = (type: SEODataSourceType): string => {
    const names: Record<SEODataSourceType, string> = {
      google_search_console: "Google Search Console",
      openai: "OpenAI",
      perplexity: "Perplexity",
      claude: "Claude (Anthropic)",
      gemini: "Google Gemini",
      custom: "Custom Provider",
    }
    return names[type] || type
  }

  const getSourceFields = (type: SEODataSourceType): Array<{ key: string; label: string; type: string }> => {
    switch (type) {
      case "google_search_console":
        return [
          { key: "access_token", label: "Access Token", type: "password" },
          { key: "property_url", label: "Property URL", type: "text" },
        ]
      case "openai":
      case "perplexity":
      case "claude":
      case "gemini":
        return [{ key: "api_key", label: "API Key", type: "password" }]
      default:
        return []
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Settings</h2>
        <p className="text-muted-foreground">Configure data sources for SEO tracking</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Connect your SEO data sources to track performance</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Add New Data Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Source Type</Label>
                  <Select
                    value={newSource.source_type}
                    onValueChange={(value) =>
                      setNewSource({ ...newSource, source_type: value as SEODataSourceType, credentials: {} })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_search_console">Google Search Console</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="perplexity">Perplexity</SelectItem>
                      <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                      <SelectItem value="custom">Custom Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Source Name</Label>
                  <Input
                    value={newSource.source_name}
                    onChange={(e) => setNewSource({ ...newSource, source_name: e.target.value })}
                    placeholder={getSourceDisplayName(newSource.source_type)}
                  />
                </div>

                {getSourceFields(newSource.source_type).map((field) => (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type}
                      value={newSource.credentials[field.key] || ""}
                      onChange={(e) =>
                        setNewSource({
                          ...newSource,
                          credentials: { ...newSource.credentials, [field.key]: e.target.value },
                        })
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <Label>Sync Frequency</Label>
                  <Select
                    value={newSource.sync_frequency}
                    onValueChange={(value) =>
                      setNewSource({ ...newSource, sync_frequency: value as "hourly" | "daily" | "weekly" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddSource} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Add Source"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {dataSources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data sources configured. Add one to start tracking SEO metrics.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dataSources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{source.source_name}</h3>
                          <Badge variant={source.is_active ? "default" : "secondary"}>
                            {source.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getSourceDisplayName(source.source_type)} • Sync: {source.sync_frequency}
                        </p>
                        {source.last_sync_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last synced: {new Date(source.last_sync_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(source.id, source.is_active)}
                      >
                        {source.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(source.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Google Search Console</h3>
            <p className="text-sm text-muted-foreground mb-2">
              To connect Google Search Console, you need to:
            </p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Create a project in Google Cloud Console</li>
              <li>Enable the Search Console API</li>
              <li>Create OAuth 2.0 credentials</li>
              <li>Authorize the application and get an access token</li>
              <li>Enter the access token and property URL above</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium mb-2">LLM Providers</h3>
            <p className="text-sm text-muted-foreground">
              For AI/LLM providers, enter your API key if available. Note that most LLM providers don&apos;t have
              public APIs for citation tracking, so we use monitoring services and webhooks to track mentions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
