"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface WindowLevelControlsProps {
  windowWidth: number
  windowCenter: number
  onWindowWidthChange: (width: number) => void
  onWindowCenterChange: (center: number) => void
}

const PRESETS = {
  brain: { width: 80, center: 40, label: "Brain" },
  bone: { width: 2000, center: 400, label: "Bone" },
  lung: { width: 1500, center: -600, label: "Lung" },
  softTissue: { width: 400, center: 40, label: "Soft Tissue" },
}

export function WindowLevelControls({
  windowWidth,
  windowCenter,
  onWindowWidthChange,
  onWindowCenterChange,
}: WindowLevelControlsProps) {
  const handleWidthChange = (value: number[]) => {
    onWindowWidthChange(value[0])
  }

  const handleCenterChange = (value: number[]) => {
    onWindowCenterChange(value[0])
  }

  const applyPreset = (preset: keyof typeof PRESETS) => {
    const { width, center } = PRESETS[preset]
    onWindowWidthChange(width)
    onWindowCenterChange(center)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Window Width</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {windowWidth}
          </span>
        </div>
        <Slider
          value={[windowWidth]}
          min={1}
          max={4000}
          step={10}
          onValueChange={handleWidthChange}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Window Center</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {windowCenter}
          </span>
        </div>
        <Slider
          value={[windowCenter]}
          min={-1000}
          max={1000}
          step={10}
          onValueChange={handleCenterChange}
        />
      </div>

    </div>
  )
}
