'use client';

import { Viewport } from './viewport';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { getSeriesSliceCount } from '@/lib/dicom-loader';

export type GridLayout = '1x1' | '1x2' | '2x2' | '3x3';

export interface ViewportGridProps {
  layout: GridLayout;
  scanId: string;
  seriesIds?: string[];
  activeViewportIndex: number;
  onViewportClick: (index: number) => void;
}

const layoutConfig: Record<GridLayout, { cols: number; rows: number; count: number }> = {
  '1x1': { cols: 1, rows: 1, count: 1 },
  '1x2': { cols: 2, rows: 1, count: 2 },
  '2x2': { cols: 2, rows: 2, count: 4 },
  '3x3': { cols: 3, rows: 3, count: 9 },
};

export function ViewportGrid({
  layout,
  scanId,
  seriesIds = [],
  activeViewportIndex,
  onViewportClick,
}: ViewportGridProps) {
  const config = layoutConfig[layout];
  const { currentSliceIndex, totalSlices } = useViewerStore();

  // Generate viewport configurations based on layout
  const viewports = Array.from({ length: config.count }, (_, index) => {
    // For multi-series view, use different series IDs
    const seriesId = seriesIds[index] || seriesIds[0] || undefined;
    
    // Use current slice index for active viewport, keep same slice for all in 1x1 mode
    // For multi-viewport layouts, you could implement different strategies
    const sliceIndex = currentSliceIndex;
    
    return {
      index,
      seriesId,
      sliceIndex,
      totalSlices,
    };
  });

  return (
    <div
      className="grid gap-[2px] bg-black w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`,
      }}
    >
      {viewports.map((viewport) => (
        <Viewport
          key={viewport.index}
          scanId={scanId}
          seriesId={viewport.seriesId}
          sliceIndex={viewport.sliceIndex}
          totalSlices={viewport.totalSlices}
          isActive={activeViewportIndex === viewport.index}
          onClick={() => onViewportClick(viewport.index)}
          className="min-h-0"
        />
      ))}
    </div>
  );
}
