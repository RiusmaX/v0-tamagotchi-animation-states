"use client"

import type * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const variantStyles = {
    default: "bg-background border-border",
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
  }

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg border-2 p-4 shadow-lg transition-all animate-in slide-in-from-top-5",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1 hover:bg-black/5 transition-colors" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">{children}</div>
}
