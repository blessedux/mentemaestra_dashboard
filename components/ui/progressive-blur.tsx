"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProgressiveBlurProps {
  className?: string
  direction?: "left" | "right" | "top" | "bottom"
  blurIntensity?: number
}

export function ProgressiveBlur({
  className,
  direction = "left",
  blurIntensity = 1,
}: ProgressiveBlurProps) {
  const gradientClasses = {
    left: "bg-gradient-to-r from-background via-background/80 to-transparent",
    right: "bg-gradient-to-l from-background via-background/80 to-transparent",
    top: "bg-gradient-to-b from-background via-background/80 to-transparent",
    bottom: "bg-gradient-to-t from-background via-background/80 to-transparent",
  }[direction]

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        gradientClasses,
        className
      )}
      style={{
        backdropFilter: `blur(${blurIntensity * 4}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 4}px)`,
      }}
    />
  )
}
