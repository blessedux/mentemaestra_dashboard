"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Ticket, Settings, Palette, LogOut, Globe, Webhook, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSelectedProject } from "@/lib/hooks/use-selected-project"
import { usePrivy } from "@privy-io/react-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Websites", href: "/dashboard/websites", icon: Webhook },
  { name: "SEO", href: "/dashboard/seo", icon: Search },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Brand Assets", href: "/dashboard/brand-assets", icon: Palette },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { selectedProjectId } = useSelectedProject()
  const { logout } = usePrivy()

  const handleSignOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("selectedProjectId")
      
      // Logout from Privy
      await logout()
      
      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if logout fails, redirect to home
      router.push("/")
    }
  }

  const handleSwitchProject = () => {
    router.push("/projects")
  }

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
      <Button
        variant="ghost"
        onClick={handleSwitchProject}
        className="justify-start gap-3 mt-4"
      >
        <Globe className="h-4 w-4" />
        Switch Project
      </Button>
      <Button variant="ghost" onClick={handleSignOut} className="justify-start gap-3">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </nav>
  )
}
