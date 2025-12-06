"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, ImageIcon, Palette, Type, FileCode, Film, Plus } from "lucide-react"

export default function BrandAssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("brand_assets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })

    setAssets(data || [])
    setIsLoading(false)
  }

  const getAssetsByType = (type: string) => {
    return assets.filter((asset) => asset.asset_type === type)
  }

  const getAssetIcon = (type: string) => {
    const icons: Record<string, any> = {
      logo: ImageIcon,
      "color-palette": Palette,
      typography: Type,
      template: FileCode,
      animation: Film,
    }
    return icons[type] || ImageIcon
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const AssetSection = ({ type, title, description }: { type: string; title: string; description: string }) => {
    const typeAssets = getAssetsByType(type)
    const Icon = getAssetIcon(type)

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Request Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {typeAssets.length === 0 ? (
            <div className="text-center py-8">
              <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No {title.toLowerCase()} available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {typeAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{asset.name}</p>
                    {asset.metadata && (
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(asset.metadata).map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return value.map((v, idx) => (
                              <Badge key={`${key}-${idx}`} variant="secondary" className="text-xs">
                                {v}
                              </Badge>
                            ))
                          }
                          return (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {value as string}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(asset.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {asset.file_url && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brand Assets</h2>
          <p className="text-muted-foreground">Access your brand guidelines and design files</p>
        </div>
      </div>

      {assets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">No brand assets available yet</p>
            <Button variant="outline">Request Assets</Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <AssetSection type="logo" title="Logos" description="Your brand logo files and variations" />
            <AssetSection type="color-palette" title="Color Palettes" description="Brand colors and design tokens" />
            <AssetSection type="typography" title="Typography" description="Font families and text styles" />
            <AssetSection type="template" title="Templates" description="Design templates and layouts" />
            <AssetSection type="animation" title="Animations" description="Motion graphics and animation files" />
          </TabsContent>

          <TabsContent value="logos">
            <AssetSection type="logo" title="Logos" description="Your brand logo files and variations" />
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle>Color Palettes</CardTitle>
                      <CardDescription>Brand colors and design tokens</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getAssetsByType("color-palette").map((asset) => (
                  <div key={asset.id} className="space-y-4">
                    <h4 className="font-medium">{asset.name}</h4>
                    {asset.metadata && (
                      <div className="grid gap-3 md:grid-cols-3">
                        {Object.entries(asset.metadata).map(([name, color]) => (
                          <div key={name} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-12 h-12 rounded-md border" style={{ backgroundColor: color as string }} />
                            <div>
                              <p className="text-sm font-medium capitalize">{name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{color as string}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {getAssetsByType("color-palette").length === 0 && (
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No color palettes available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle>Typography</CardTitle>
                      <CardDescription>Font families and text styles</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getAssetsByType("typography").map((asset) => (
                  <div key={asset.id} className="space-y-4">
                    <h4 className="font-medium">{asset.name}</h4>
                    {asset.metadata && (
                      <div className="space-y-3">
                        {Object.entries(asset.metadata).map(([name, font]) => (
                          <div key={name} className="p-4 border rounded-lg">
                            <p className="text-sm font-medium capitalize mb-2">{name} Font</p>
                            <p className="text-2xl" style={{ fontFamily: font as string }}>
                              {font as string}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              The quick brown fox jumps over the lazy dog
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {getAssetsByType("typography").length === 0 && (
                  <div className="text-center py-8">
                    <Type className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No typography assets available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <AssetSection type="template" title="Templates" description="Design templates and layouts" />
          </TabsContent>

          <TabsContent value="animations">
            <AssetSection type="animation" title="Animations" description="Motion graphics and animation files" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
