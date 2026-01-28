'use client';

import { ViewerCanvas } from './viewer-canvas';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { Card } from '@/components/ui/card';

interface DicomViewerProps {
  scanId: string;
  totalSlices: number;
}

export function DicomViewer({ scanId, totalSlices }: DicomViewerProps) {
  const { currentSliceIndex, gridSize } = useViewerStore();

  if (gridSize === 1) {
    return (
      <Card className="bg-darker border-border overflow-hidden aspect-square">
        <ViewerCanvas
          scanId={scanId}
          sliceIndex={currentSliceIndex}
        />
      </Card>
    );
  }

  // Multi-slice grid view
  const gridCols = Math.sqrt(gridSize);
  const slices = Array.from({ length: gridSize }, (_, i) => {
    const sliceIndex = Math.floor((i / gridSize) * totalSlices);
    return sliceIndex;
  });

  return (
    <Card className="bg-darker border-border overflow-hidden">
      <div
        className="grid gap-1 p-1"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        }}
      >
        {slices.map((sliceIndex, i) => (
          <ViewerCanvas
            key={i}
            scanId={scanId}
            sliceIndex={sliceIndex}
            className="aspect-square"
          />
        ))}
      </div>
    </Card>
  );
}
