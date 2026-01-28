'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { mockScans } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ViewerToolbar } from './viewer-toolbar';
import { StudyBrowser } from './study-browser';
import { ViewportGrid, GridLayout } from './viewport-grid';
import { MeasurementPanel, Measurement } from './measurement-panel';
import { AIFinding } from '@/lib/types';

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

function ViewerLayoutContent({ modality }: ViewerLayoutProps) {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scan');
  const { 
    setCurrentScan, 
    reset,
  } = useViewerStore();

  // State management for new layout
  const [activeTool, setActiveTool] = useState('pan');
  const [layout, setLayout] = useState<GridLayout>('1x1');
  const [activeViewport, setActiveViewport] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);

  const scan = scanId ? mockScans.find((s) => s.id === scanId) : null;
  const scans = scan ? mockScans.filter((s) => s.patientId === scan.patientId) : [];

  useEffect(() => {
    if (scan) {
      setCurrentScan(scan.id, scan.sliceCount);
    }

    return () => {
      reset();
    };
  }, [scan, setCurrentScan, reset]);

  const handleScanSelect = (selectedScanId: string) => {
    // Update URL to select the new scan
    const url = new URL(window.location.href);
    url.searchParams.set('scan', selectedScanId);
    window.history.pushState({}, '', url);
    
    const selectedScan = mockScans.find((s) => s.id === selectedScanId);
    if (selectedScan) {
      setCurrentScan(selectedScan.id, selectedScan.sliceCount);
    }
  };

  const handleDeleteMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const handleExportMeasurements = () => {
    // Export functionality placeholder
    console.log('Exporting measurements:', measurements);
  };

  if (!scan) {
    return <ScanSelector modality={modality} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black">
      {/* Toolbar at top */}
      <ViewerToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        layout={layout}
        onLayoutChange={(newLayout) => setLayout(newLayout as GridLayout)}
        aiEnabled={aiEnabled}
        onAiToggle={() => setAiEnabled(!aiEnabled)}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Study Browser on left */}
        <StudyBrowser
          scans={scans.length > 0 ? scans : [scan]}
          selectedScanId={scan.id}
          onScanSelect={handleScanSelect}
          modality={modality}
        />

        {/* Viewport Grid in center */}
        <div className="flex-1 bg-black">
          <ViewportGrid
            layout={layout}
            scanId={scan.id}
            activeViewportIndex={activeViewport}
            onViewportClick={setActiveViewport}
          />
        </div>

        {/* Measurement Panel on right */}
        <MeasurementPanel
          scanId={scan.id}
          measurements={measurements}
          aiFindings={[]}
          overallAssessment=""
          onDeleteMeasurement={handleDeleteMeasurement}
          onExport={handleExportMeasurements}
        />
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
