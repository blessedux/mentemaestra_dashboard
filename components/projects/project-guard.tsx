"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ProjectGuard({ children }: { children: React.ReactNode }) {
  // NO AUTH - Disabled project guard for development
  // const router = useRouter()

  // useEffect(() => {
  //   // Check if a project is selected
  //   const selectedProjectId = localStorage.getItem("selectedProjectId")
  //   if (!selectedProjectId) {
  //     router.push("/projects")
  //   }
  // }, [router])

  return <>{children}</>
}
