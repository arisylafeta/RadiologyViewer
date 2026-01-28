"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface SliceNavigatorProps {
  currentSlice: number
  totalSlices: number
  onSliceChange: (slice: number) => void
}

export function SliceNavigator({
  currentSlice,
  totalSlices,
  onSliceChange,
}: SliceNavigatorProps) {
  const handlePrevious = () => {
    if (currentSlice > 0) {
      onSliceChange(currentSlice - 1)
    }
  }

  const handleNext = () => {
    if (currentSlice < totalSlices - 1) {
      onSliceChange(currentSlice + 1)
    }
  }

  const handleSliderChange = (value: number[]) => {
    onSliceChange(value[0])
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handlePrevious}
        disabled={currentSlice <= 0}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="text-sm font-medium tabular-nums">
          {currentSlice + 1}
        </span>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {totalSlices}
        </span>
      </div>

      <Slider
        value={[currentSlice]}
        min={0}
        max={totalSlices - 1}
        step={1}
        onValueChange={handleSliderChange}
        className="w-32"
      />

      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleNext}
        disabled={currentSlice >= totalSlices - 1}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
