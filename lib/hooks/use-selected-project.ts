"use client"

import { useState, useEffect } from "react"

export function useSelectedProject() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    // Get from localStorage on mount
    const projectId = localStorage.getItem("selectedProjectId")
    setSelectedProjectId(projectId)

    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "selectedProjectId") {
        setSelectedProjectId(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const setProject = (projectId: string | null) => {
    if (projectId) {
      localStorage.setItem("selectedProjectId", projectId)
    } else {
      localStorage.removeItem("selectedProjectId")
    }
    setSelectedProjectId(projectId)
  }

  return { selectedProjectId, setProject }
}
