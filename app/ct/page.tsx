'use client';

import { useState } from 'react';
import { mockScans } from '@/lib/mock-data';
import { DicomViewer } from '@/components/viewer/dicom-viewer';
import { ViewerControls } from '@/components/viewer/viewer-controls';
import { AIAnalysisPanel } from '@/components/ai-panel/ai-analysis-panel';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { Card } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Scan } from '@/lib/types';


type Tool = 'pan' | 'zoom' | 'measure';
type GridView = '1x1' | '2x2' | '3x3' | '4x4';

const gridViewToSize: Record<GridView, 1 | 4 | 9 | 16> = {
  '1x1': 1,
  '2x2': 4,
  '3x3': 9,
  '4x4': 16,
};

export default function CTPage() {
  const ctScans = mockScans.filter((scan) => scan.modality === 'CT');
  const [selectedScan, setSelectedScan] = useState<Scan | null>(
    ctScans.length > 0 ? ctScans[0] : null
  );

  const {
    currentSliceIndex,
    totalSlices,
    windowWidth,
    windowCenter,
    activeTool,
    showAIOverlay,
    gridSize,
    setCurrentScan,
    setSliceIndex,
    setWindowLevel,
    setActiveTool,
    toggleAIOverlay,
    setGridSize,
  } = useViewerStore();

  // Set initial scan
  useState(() => {
    if (selectedScan) {
      setCurrentScan(selectedScan.id, selectedScan.sliceCount);
    }
  });

  const handleScanSelect = (scan: Scan) => {
    setSelectedScan(scan);
    setCurrentScan(scan.id, scan.sliceCount);
  };

  const handleGridViewChange = (view: GridView) => {
    setGridSize(gridViewToSize[view]);
  };

  const getGridView = (): GridView => {
    const viewMap: Record<1 | 4 | 9 | 16, GridView> = {
      1: '1x1',
      4: '2x2',
      9: '3x3',
      16: '4x4',
    };
    return viewMap[gridSize];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CT Scans</h1>
        <p className="text-muted-foreground">
          View and analyze CT imaging studies
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Scan List */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold">Available Scans</h2>
          <div className="space-y-2">
            {ctScans.map((scan) => (
              <Card
                key={scan.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedScan?.id === scan.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleScanSelect(scan)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{scan.patientName}</span>
                    <Badge variant={scan.status === 'analyzed' ? 'default' : 'secondary'}>
                      {scan.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{scan.bodyPart}</p>
                    <p>{scan.sliceCount} slices</p>
                    <p>{new Date(scan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  {scan.hasAIOverlay && (
                    <Badge variant="outline" className="text-xs">
                      AI Analysis Available
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Viewer */}
        <div className="col-span-6 space-y-4">
          {selectedScan ? (
            <>
              <ViewerControls
                totalSlices={selectedScan.sliceCount}
                currentSlice={currentSliceIndex}
                onSliceChange={setSliceIndex}
                windowWidth={windowWidth}
                windowCenter={windowCenter}
                onWindowWidthChange={(width) => setWindowLevel(width, windowCenter)}
                onWindowCenterChange={(center) => setWindowLevel(windowWidth, center)}
                activeTool={activeTool as Tool}
                onToolChange={(tool) => setActiveTool(tool)}
                gridView={getGridView()}
                onGridViewChange={handleGridViewChange}
                aiOverlayEnabled={showAIOverlay}
                onAiOverlayToggle={toggleAIOverlay}
              />
              <DicomViewer
                scanId={selectedScan.id}
                totalSlices={selectedScan.sliceCount}
              />
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Select a scan to view</p>
            </Card>
          )}
        </div>

        {/* AI Analysis Panel */}
        <div className="col-span-3">
          {selectedScan ? (
            <AIAnalysisPanel scanId={selectedScan.id} />
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                Select a scan to view AI analysis
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
