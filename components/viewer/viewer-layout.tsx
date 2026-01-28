'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { mockScans, mockAIAnalyses } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ViewerToolbar } from './viewer-toolbar';
import { CTToolbar } from './toolbars/ct-toolbar';
import { StudyBrowser } from './study-browser';
import { ViewportGrid, GridLayout } from './viewport-grid';
import { MeasurementPanel, Measurement } from './measurement-panel';
import { Scan } from '@/lib/types';
import { CTMeasurement } from './panels/ct-measurements';
import { MRIMeasurement } from './panels/mri-measurements';
import { XRayMeasurement } from './panels/xray-measurements';

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
  const [layout, setLayout] = useState<GridLayout>(modality === 'MRI' ? '2x2' : '1x1');
  const [activeViewport, setActiveViewport] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  // Initialize with default MRI series for immediate rendering
  const [viewportSeries, setViewportSeries] = useState<string[]>(
    modality === 'MRI' 
      ? ['mri-shoulder-001-s002', 'mri-shoulder-001-s003', 'mri-shoulder-001-s005', 'mri-shoulder-001-s006']
      : []
  );
  
  // Use viewer store for slice navigation
  const { currentSliceIndex, totalSlices, setSliceIndex } = useViewerStore();

  // Modality-specific measurements state
  const [ctMeasurements, setCtMeasurements] = useState<CTMeasurement[]>([
    {
      id: '1',
      type: 'hu-roi',
      value: 145.5,
      unit: 'mm²',
      location: 'Tibial cortex',
      timestamp: new Date().toISOString(),
      huStats: {
        mean: 1425.3,
        min: 1200,
        max: 1650,
        stdDev: 120.2,
      },
    },
    {
      id: '2',
      type: 'hu-probe',
      value: 850,
      unit: 'HU',
      location: 'Medial malleolus',
      timestamp: new Date().toISOString(),
    },
  ]);

  // CT metadata state
  const [ctMetadata, setCtMetadata] = useState<{
    windowPresets?: Record<string, { name: string; width: number; level: number; description?: string }>;
  }>({});

  // CT preset state
  const [ctPreset, setCtPreset] = useState('standard');

  const [mriMeasurements, setMriMeasurements] = useState<MRIMeasurement[]>([
    {
      id: '1',
      type: 'intensity-roi',
      value: 85.2,
      unit: 'mm²',
      location: 'Lezione e bardhë e substancës',
      sequence: 't2',
      timestamp: new Date().toISOString(),
      intensityStats: {
        mean: 185.4,
        min: 142,
        max: 228,
        stdDev: 22.1,
      },
    },
  ]);

  const [xrayMeasurements, setXrayMeasurements] = useState<XRayMeasurement[]>([
    {
      id: '1',
      type: 'length',
      value: 145.2,
      unit: 'mm',
      location: 'Raporti kardiotorakik',
      timestamp: new Date().toISOString(),
      description: 'Gjerësia e siluetës kardiake',
    },
    {
      id: '2',
      type: 'length',
      value: 280.5,
      unit: 'mm',
      location: 'Kavieteti torakik',
      timestamp: new Date().toISOString(),
      description: 'Gjerësia totale torakike',
    },
    {
      id: '3',
      type: 'angle',
      value: 8.5,
      unit: '°',
      location: 'Këndi kostofrenik majtas',
      timestamp: new Date().toISOString(),
      description: 'Mprehtësia e këndit kostofrenik',
    },
  ]);

  // Get scan from URL or auto-select first scan of this modality
  const modalityScans = mockScans.filter((s) => s.modality === modality);
  const scan: Scan | null = scanId 
    ? (mockScans.find((s) => s.id === scanId) ?? null)
    : (modalityScans[0] ?? null);
  const scans: Scan[] = scan ? mockScans.filter((s) => s.patientId === scan.patientId) : [];

  // Get AI analysis for current scan
  const aiAnalysis = scan ? mockAIAnalyses[scan.id] : null;
  const aiFindings = aiAnalysis?.findings || [];
  const overallAssessment = aiAnalysis?.overallAssessment || '';

  useEffect(() => {
    if (scan) {
      setCurrentScan(scan.id, scan.sliceCount);
    }

    return () => {
      reset();
    };
  }, [scan, setCurrentScan, reset]);

  // Initialize default series for 2x2 layout when MRI shoulder scan is loaded
  useEffect(() => {
    if (scan && modality === 'MRI' && scan.id === 'mri-shoulder-001') {
      // Default 2x2 grid series: T2, T1 SAG, STIR, T1 COR
      setViewportSeries([
        'mri-shoulder-001-s002', // T2
        'mri-shoulder-001-s003', // T1 SAG
        'mri-shoulder-001-s005', // STIR
        'mri-shoulder-001-s006', // T1 COR
      ]);
    }
  }, [scan, modality]);

  // Load CT metadata from JSON
  useEffect(() => {
    const loadMetadata = async () => {
      if (modality === 'CT' && scan && scan.dicomPath) {
        try {
          const metadataPath = scan.dicomPath + '/metadata.json';
          const response = await fetch(metadataPath);
          if (response.ok) {
            const metadata = await response.json();
            setCtMetadata(metadata);
          }
        } catch (error) {
          console.error('Error loading CT metadata:', error);
        }
      }
    };

    loadMetadata();
  }, [modality, scan]);

  // Prevent body scroll when viewer is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  const handleSeriesSelect = (viewportIndex: number, seriesId: string) => {
    const newSeries = [...viewportSeries];
    newSeries[viewportIndex] = seriesId;
    setViewportSeries(newSeries);
  };

  if (!scan) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted">No scans available for this modality</p>
      </div>
    );
  }

  return (
    <div className="fixed left-4 right-4 top-[6rem] bottom-4 flex flex-col bg-black rounded-lg overflow-hidden">
      {/* Toolbar at top */}
      <div className="flex items-center gap-2">
        <ViewerToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          layout={layout}
          onLayoutChange={(newLayout) => setLayout(newLayout as GridLayout)}
          aiEnabled={aiEnabled}
          onAiToggle={() => setAiEnabled(!aiEnabled)}
          modality={modality}
          currentSlice={currentSliceIndex}
          totalSlices={totalSlices}
          onSliceChange={setSliceIndex}
        />
        {/* CT Toolbar */}
        {modality === 'CT' && (
          <CTToolbar
            activePreset={ctPreset}
            onPresetChange={setCtPreset}
            presets={ctMetadata.windowPresets}
          />
        )}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Study Browser on left */}
        <StudyBrowser
          scans={scans.length > 0 ? scans : [scan]}
          selectedScanId={scan.id}
          onScanSelect={handleScanSelect}
          onSeriesSelect={handleSeriesSelect}
          modality={modality}
        />

        {/* Viewport Grid in center */}
        <div className="flex-1 bg-black">
          <ViewportGrid
            layout={layout}
            scanId={scan.id}
            seriesIds={viewportSeries}
            activeViewportIndex={activeViewport}
            onViewportClick={setActiveViewport}
          />
        </div>

        {/* Measurement Panel on right */}
        <MeasurementPanel
          scanId={scan.id}
          modality={modality}
          measurements={measurements}
          aiFindings={aiFindings}
          overallAssessment={overallAssessment}
          onDeleteMeasurement={handleDeleteMeasurement}
          onExport={handleExportMeasurements}
          ctMeasurements={modality === 'CT' ? ctMeasurements : undefined}
          mriMeasurements={modality === 'MRI' ? mriMeasurements : undefined}
          xrayMeasurements={modality === 'XRAY' ? xrayMeasurements : undefined}
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
