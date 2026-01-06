"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InfiniteSliderProps {
  children: React.ReactNode
  speed?: number
  speedOnHover?: number
  gap?: number
  className?: string
}

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover = 20,
  gap = 112,
  className,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const sliderRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    let animationId: number
    let currentPosition = 0
    const speedValue = isHovered ? speedOnHover : speed

    const animate = () => {
      currentPosition -= 0.5
      slider.style.transform = `translateX(${currentPosition}px)`

      // Reset position when content has scrolled completely
      if (Math.abs(currentPosition) >= slider.scrollWidth / 2) {
        currentPosition = 0
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [speed, speedOnHover, isHovered])

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={sliderRef}
        className="flex w-max"
        style={{
          gap: `${gap}px`,
        }}
      >
        {children}
        {children} {/* Duplicate for seamless loop */}
      </div>
    </div>
  )
}
