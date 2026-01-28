"use client";

import { Brain, Bone, Scan, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const quickActions = [
  {
    title: "Upload MRI",
    description: "Analyze brain and body scans",
    icon: Brain,
    href: "/mri",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    title: "Upload X-Ray",
    description: "Chest and bone imaging",
    icon: Bone,
    href: "/xray",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
  },
  {
    title: "Upload CT",
    description: "Cross-sectional analysis",
    icon: Scan,
    href: "/ct",
    color: "text-lime-600",
    bgColor: "bg-lime-50",
  },
  {
    title: "Import from Government",
    description: "Access national records",
    icon: Upload,
    href: "/import",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${action.bgColor}`}
              >
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                {action.title}
              </h3>
              <p className="mt-1 text-center text-xs text-gray-500">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
