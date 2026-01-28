"use client"

import Link from "next/link"
import { mockScans } from "@/lib/mock-data"
import { Scan } from "@/lib/types"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Download } from "lucide-react"

export function RecentScansTable() {
  const recentScans = mockScans.slice(0, 5)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Modality</TableHead>
          <TableHead>Body Part</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentScans.map((scan: Scan) => (
          <TableRow key={scan.id}>
            <TableCell className="font-medium">{scan.patientName}</TableCell>
            <TableCell>{scan.modality}</TableCell>
            <TableCell>{scan.bodyPart}</TableCell>
            <TableCell>{scan.date}</TableCell>
            <TableCell>
              <StatusBadge status={scan.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/${scan.modality.toLowerCase()}?scan=${scan.id}`}>
                  <Button variant="ghost" size="icon-sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon-sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
