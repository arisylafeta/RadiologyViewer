"use client"

import React from "react"
import {
  Move,
  ZoomIn,
  Sun,
  Contrast,
  RotateCcw,
  Ruler,
  Triangle,
  Square,
  Circle,
  Target,
  ArrowUp,
  Type,
  Pencil,
  LayoutGrid,
  Brain,
  Eye,
  EyeOff,
  Download,
  Share2,
  Printer,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CTToolbar } from './toolbars/ct-toolbar';
import { MRIToolbar } from './toolbars/mri-toolbar';
import { XRayToolbar } from './toolbars/xray-toolbar';
import { SliceNavigator } from './slice-navigator';

interface ViewerToolbarProps {
  activeTool: string
  onToolChange: (tool: string) => void
  layout: "1x1" | "1x2" | "2x2" | "3x3"
  onLayoutChange: (layout: string) => void
  aiEnabled: boolean
  onAiToggle: () => void
  modality?: 'CT' | 'MRI' | 'XRAY'
  currentSlice?: number
  totalSlices?: number
  onSliceChange?: (slice: number) => void
}

interface ToolButtonProps {
  tool: string
  icon: React.ReactNode
  label: string
  activeTool: string
  onToolChange: (tool: string) => void
}

function ToolButton({ tool, icon, label, activeTool, onToolChange }: ToolButtonProps) {
  const isActive = activeTool === tool

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onToolChange(tool)}
          className={cn(
            "h-7 w-7 rounded-md transition-all duration-150",
            "text-white/70 hover:text-white hover:bg-white/10",
            isActive && "bg-primary text-white hover:bg-primary hover:text-white"
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function ToolbarSeparator() {
  return <div className="h-6 w-px bg-white/10 mx-1" />
}

export function ViewerToolbar({
  activeTool,
  onToolChange,
  layout,
  onLayoutChange,
  aiEnabled,
  onAiToggle,
  modality,
  currentSlice = 0,
  totalSlices = 1,
  onSliceChange,
}: ViewerToolbarProps) {
  const [ctPreset, setCtPreset] = React.useState('brain');
  const [mriSequence, setMriSequence] = React.useState('t1');
  const [xrayView, setXrayView] = React.useState('standard');
  const navigationTools = [
    { tool: "pan", icon: <Move className="h-4 w-4" />, label: "Pan" },
    { tool: "zoom", icon: <ZoomIn className="h-4 w-4" />, label: "Zoom" },
    { tool: "windowLevel", icon: <Sun className="h-4 w-4" />, label: "Window/Level" },
    { tool: "invert", icon: <Contrast className="h-4 w-4" />, label: "Invert" },
    { tool: "reset", icon: <RotateCcw className="h-4 w-4" />, label: "Reset" },
  ]

  const measurementTools = [
    { tool: "length", icon: <Ruler className="h-4 w-4" />, label: "Length" },
    { tool: "angle", icon: <Triangle className="h-4 w-4" />, label: "Angle" },
    { tool: "rectangle", icon: <Square className="h-4 w-4" />, label: "Rectangle ROI" },
    { tool: "ellipse", icon: <Circle className="h-4 w-4" />, label: "Ellipse ROI" },
    { tool: "probe", icon: <Target className="h-4 w-4" />, label: "Probe" },
  ]

  const annotationTools = [
    { tool: "arrow", icon: <ArrowUp className="h-4 w-4" />, label: "Arrow" },
    { tool: "text", icon: <Type className="h-4 w-4" />, label: "Text" },
    { tool: "freehand", icon: <Pencil className="h-4 w-4" />, label: "Freehand" },
  ]

  const layoutOptions = [
    { value: "1x1", label: "1 x 1" },
    { value: "1x2", label: "1 x 2" },
    { value: "2x2", label: "2 x 2" },
    { value: "3x3", label: "3 x 3" },
  ]

  return (
    <TooltipProvider>
      <div
        className="flex items-center gap-2 px-4 py-1.5 h-10 border-b border-white/10"
        style={{ backgroundColor: "#0f0f0f" }}
      >
        {/* Navigation Tools */}
        <div className="flex items-center gap-1">
          {navigationTools.map(({ tool, icon, label }) => (
            <ToolButton
              key={tool}
              tool={tool}
              icon={icon}
              label={label}
              activeTool={activeTool}
              onToolChange={onToolChange}
            />
          ))}
        </div>

        <ToolbarSeparator />

        {/* Measurement Tools */}
        <div className="flex items-center gap-1">
          {measurementTools.map(({ tool, icon, label }) => (
            <ToolButton
              key={tool}
              tool={tool}
              icon={icon}
              label={label}
              activeTool={activeTool}
              onToolChange={onToolChange}
            />
          ))}
        </div>

        <ToolbarSeparator />

        {/* Annotation Tools */}
        <div className="flex items-center gap-1">
          {annotationTools.map(({ tool, icon, label }) => (
            <ToolButton
              key={tool}
              tool={tool}
              icon={icon}
              label={label}
              activeTool={activeTool}
              onToolChange={onToolChange}
            />
          ))}
        </div>

        {/* Modality-Specific Tools */}
        {modality === 'CT' && (
          <CTToolbar activePreset={ctPreset} onPresetChange={setCtPreset} />
        )}
        {modality === 'MRI' && (
          <MRIToolbar activeSequence={mriSequence} onSequenceChange={setMriSequence} />
        )}
        {modality === 'XRAY' && (
          <XRayToolbar activeView={xrayView} onViewChange={setXrayView} />
        )}

        <ToolbarSeparator />

        {/* Slice Navigator */}
        {onSliceChange && (
          <SliceNavigator
            currentSlice={currentSlice}
            totalSlices={totalSlices}
            onSliceChange={onSliceChange}
          />
        )}

        <ToolbarSeparator />

        {/* Layout Dropdown */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-white/70 hover:text-white hover:bg-white/10 gap-1 text-xs"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>{layout}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
                <p className="text-xs">Layout</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="bg-slate-900 border-slate-700">
              {layoutOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onLayoutChange(option.value)}
                  className={cn(
                    "text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs",
                    layout === option.value && "bg-primary text-white"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ToolbarSeparator />

        {/* AI Tools */}
        <div className="flex items-center gap-1">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onAiToggle}
                className={cn(
                  "h-7 w-7 rounded-md transition-all duration-150",
                  aiEnabled
                    ? "bg-primary text-white hover:bg-primary hover:text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Brain className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
              <p className="text-xs">{aiEnabled ? "Disable AI" : "Enable AI"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-white/70 hover:text-white hover:bg-white/10"
              >
                {aiEnabled ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
              <p className="text-xs">{aiEnabled ? "Hide Findings" : "Show Findings"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <ToolbarSeparator />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-white/70 hover:text-white hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
              <p className="text-xs">Download</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-white/70 hover:text-white hover:bg-white/10"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
              <p className="text-xs">Share</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-md text-white-70 hover:text-white hover:bg-white/10"
              >
                <Printer className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
              <p className="text-xs">Print</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
