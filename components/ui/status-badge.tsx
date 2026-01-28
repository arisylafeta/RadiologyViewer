"use client"

import { ScanStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: ScanStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variantMap: Record<ScanStatus, "secondary" | "default" | "outline"> = {
    pending: "secondary",
    analyzed: "default",
    reviewed: "outline",
  }

  const labelMap: Record<ScanStatus, string> = {
    pending: "Pending",
    analyzed: "Analyzed",
    reviewed: "Reviewed",
  }

  return (
    <Badge variant={variantMap[status]}>
      {labelMap[status]}
    </Badge>
  )
}
