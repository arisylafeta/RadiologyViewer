"use client"

import { useState } from "react"
import { Move, ZoomIn, Ruler, Grid3X3, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SliceNavigator } from "./slice-navigator"
import { WindowLevelControls } from "./window-level-controls"

type Tool = "pan" | "zoom" | "measure"
type GridView = "1x1" | "2x2" | "3x3" | "4x4"

interface ViewerControlsProps {
  totalSlices: number
  currentSlice: number
  onSliceChange: (slice: number) => void
  windowWidth: number
  windowCenter: number
  onWindowWidthChange: (width: number) => void
  onWindowCenterChange: (center: number) => void
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  gridView: GridView
  onGridViewChange: (view: GridView) => void
  aiOverlayEnabled: boolean
  onAiOverlayToggle: () => void
}

export function ViewerControls({
  totalSlices,
  currentSlice,
  onSliceChange,
  windowWidth,
  windowCenter,
  onWindowWidthChange,
  onWindowCenterChange,
  activeTool,
  onToolChange,
  gridView,
  onGridViewChange,
  aiOverlayEnabled,
  onAiOverlayToggle,
}: ViewerControlsProps) {
  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "pan", icon: <Move className="size-4" />, label: "Pan" },
    { id: "zoom", icon: <ZoomIn className="size-4" />, label: "Zoom" },
    { id: "measure", icon: <Ruler className="size-4" />, label: "Measure" },
  ]

  const gridViews: { id: GridView; label: string }[] = [
    { id: "1x1", label: "1x1" },
    { id: "2x2", label: "2x2" },
    { id: "3x3", label: "3x3" },
    { id: "4x4", label: "4x4" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-lg">
      {/* Tool Buttons */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="gap-1"
          >
            {tool.icon}
            <span className="text-xs">{tool.label}</span>
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Grid View Buttons */}
      <div className="flex items-center gap-1">
        {gridViews.map((view) => (
          <Button
            key={view.id}
            variant={gridView === view.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onGridViewChange(view.id)}
            className="text-xs min-w-[32px]"
          >
            {view.label}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Slice Navigator */}
      <SliceNavigator
        currentSlice={currentSlice}
        totalSlices={totalSlices}
        onSliceChange={onSliceChange}
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Window/Level Controls */}
      <div className="w-48">
        <WindowLevelControls
          windowWidth={windowWidth}
          windowCenter={windowCenter}
          onWindowWidthChange={onWindowWidthChange}
          onWindowCenterChange={onWindowCenterChange}
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* AI Overlay Toggle */}
      <Button
        variant={aiOverlayEnabled ? "default" : "outline"}
        size="sm"
        onClick={onAiOverlayToggle}
        className="gap-1"
      >
        <Brain className="size-4" />
        <span className="text-xs">AI</span>
      </Button>
    </div>
  )
}
