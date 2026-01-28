'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { DicomViewer } from './dicom-viewer';
import { ViewerControls } from './viewer-controls';
import { AIAnalysisPanel } from '../ai-panel/ai-analysis-panel';
import { mockScans } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface ViewerLayoutProps {
  modality: 'MRI' | 'CT' | 'XRAY';
}

function ScanSelector({ modality }: { modality: string }) {
  const scans = mockScans.filter((s) => s.modality === modality);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg text-text-primary mb-2">Select a scan to view</p>
        <p className="text-sm text-text-muted">
          Choose from available {modality} scans below
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan) => (
          <Card key={scan.id} className="bg-dark border-border overflow-hidden">
            <div className="aspect-video bg-darker relative">
              <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                <span className="text-sm">{scan.bodyPart}</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-text-primary">{scan.patientName}</h3>
              <p className="text-sm text-text-muted">{scan.bodyPart} {scan.modality}</p>
              <p className="text-xs text-text-muted">
                {new Date(scan.date).toLocaleDateString()}
              </p>
              <p className="text-xs text-text-muted">
                {scan.sliceCount} {scan.sliceCount === 1 ? 'slice' : 'slices'}
              </p>
              <Link href={`?scan=${scan.id}`} className="block">
                <Button variant="default" size="sm" className="w-full">
                  View Scan
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

type Tool = 'pan' | 'zoom' | 'measure';
type GridView = '1x1' | '2x2' | '3x3' | '4x4';

const gridViewToSize: Record<GridView, 1 | 4 | 9 | 16> = {
  '1x1': 1,
  '2x2': 4,
  '3x3': 9,
  '4x4': 16,
};

const sizeToGridView: Record<1 | 4 | 9 | 16, GridView> = {
  1: '1x1',
  4: '2x2',
  9: '3x3',
  16: '4x4',
};

function ViewerLayoutContent({ modality }: ViewerLayoutProps) {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scan');
  const { 
    setCurrentScan, 
    reset,
    currentSliceIndex,
    totalSlices,
    windowWidth,
    windowCenter,
    activeTool,
    showAIOverlay,
    gridSize,
    setSliceIndex,
    setWindowLevel,
    setActiveTool,
    toggleAIOverlay,
    setGridSize,
  } = useViewerStore();

  const scan = scanId ? mockScans.find((s) => s.id === scanId) : null;

  useEffect(() => {
    if (scan) {
      setCurrentScan(scan.id, scan.sliceCount);
    }

    return () => {
      reset();
    };
  }, [scan, setCurrentScan, reset]);

  if (!scan) {
    return <ScanSelector modality={modality} />;
  }

  const handleGridViewChange = (view: GridView) => {
    setGridSize(gridViewToSize[view]);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      <div className="col-span-3 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Patient Information
          </h3>
          <div className="text-sm text-text-muted space-y-1">
            <p>{scan.patientName}</p>
            <p>{scan.bodyPart} {modality}</p>
            <p>{new Date(scan.date).toLocaleDateString()}</p>
          </div>
        </div>
        <ViewerControls
          totalSlices={totalSlices}
          currentSlice={currentSliceIndex}
          onSliceChange={setSliceIndex}
          windowWidth={windowWidth}
          windowCenter={windowCenter}
          onWindowWidthChange={(width) => setWindowLevel(width, windowCenter)}
          onWindowCenterChange={(center) => setWindowLevel(windowWidth, center)}
          activeTool={activeTool as Tool}
          onToolChange={(tool) => setActiveTool(tool)}
          gridView={sizeToGridView[gridSize]}
          onGridViewChange={handleGridViewChange}
          aiOverlayEnabled={showAIOverlay}
          onAiOverlayToggle={toggleAIOverlay}
        />
      </div>

      <div className="col-span-6">
        <DicomViewer scanId={scan.id} totalSlices={scan.sliceCount} />
      </div>

      <div className="col-span-3 overflow-y-auto">
        <AIAnalysisPanel scanId={scan.id} />
      </div>
    </div>
  );
}

export function ViewerLayout({ modality }: ViewerLayoutProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">Loading viewer...</p>
        </div>
      </div>
    }>
      <ViewerLayoutContent modality={modality} />
    </Suspense>
  );
}
