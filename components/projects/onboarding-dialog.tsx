"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

interface OnboardingDialogProps {
  open: boolean
  onComplete: () => void
  projectName: string
}

export function OnboardingDialog({ open, onComplete, projectName }: OnboardingDialogProps) {
  const [step, setStep] = useState(1)

  const stepContent = [
    {
      title: `Welcome to ${projectName}`,
      description:
        "Discover a powerful dashboard designed to help you manage your project efficiently and track your progress.",
    },
    {
      title: "Customizable Dashboard",
      description:
        "Each section is fully customizable and built with modern web standards to provide you with the best experience.",
    },
    {
      title: "Ready to Start?",
      description: "Begin managing your project with our comprehensive dashboard and analytics tools.",
    },
    {
      title: "Get Support",
      description:
        "Access our extensive documentation and support resources to make the most of your dashboard experience.",
    },
  ]

  const totalSteps = stepContent.length

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1)
    }
  }, [open])

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleOnboardingComplete()
    }
  }

  const handleOnboardingComplete = () => {
    onComplete()
  }

  const handleOpenChange = (newOpen: boolean) => {
    // If dialog is being closed (via skip or outside click), mark onboarding as complete
    if (!newOpen) {
      handleOnboardingComplete()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2">
          <img
            className="w-full rounded-lg"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
            width={382}
            height={216}
            alt="Onboarding"
          />
        </div>
        <div className="space-y-6 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>{stepContent[step - 1].description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-primary",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button className="group" type="button" onClick={handleContinue}>
                  Next
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button type="button" onClick={handleOnboardingComplete}>
                  Get Started
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
