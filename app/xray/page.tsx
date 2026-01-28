'use client';

import { useSearchParams } from 'next/navigation';
import { mockScans, mockAIAnalyses } from '@/lib/mock-data';
import { DicomViewer } from '@/components/viewer/dicom-viewer';
import { ViewerControls } from '@/components/viewer/viewer-controls';
import { AIAnalysisPanel } from '@/components/ai-panel/ai-analysis-panel';
import { SliceNavigator } from '@/components/viewer/slice-navigator';
import { WindowLevelControls } from '@/components/viewer/window-level-controls';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function XRayPage() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scan');

  // Filter scans for XRAY modality
  const xrayScans = mockScans.filter((scan) => scan.modality === 'XRAY');

  // Get selected scan or first XRAY scan
  const selectedScan = scanId
    ? xrayScans.find((s) => s.id === scanId)
    : xrayScans[0];

  const aiAnalysis = selectedScan ? mockAIAnalyses[selectedScan.id] : null;

  if (!selectedScan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">X-Ray Scans</h1>
          <p className="text-muted-foreground">
            View and analyze X-ray imaging scans
          </p>
        </div>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No X-ray scans available</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">X-Ray Scans</h1>
          <p className="text-muted-foreground">
            View and analyze X-ray imaging scans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedScan.bodyPart}</Badge>
          <Badge variant="secondary">{selectedScan.patientName}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Viewer Area */}
        <div className="lg:col-span-2 space-y-4">
          <DicomViewer
            scanId={selectedScan.id}
            totalSlices={selectedScan.sliceCount}
          />
          
          <ViewerControls />
          
          <div className="grid grid-cols-2 gap-4">
            <SliceNavigator totalSlices={selectedScan.sliceCount} />
            <WindowLevelControls />
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-4">
          <AIAnalysisPanel
            scanId={selectedScan.id}
            analysis={aiAnalysis}
          />

          <Separator />

          {/* Scan List */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Available X-Ray Scans</h3>
            <div className="space-y-2">
              {xrayScans.map((scan) => (
                <a
                  key={scan.id}
                  href={`/xray?scan=${scan.id}`}
                  className={`block p-3 rounded-lg border transition-colors ${
                    scan.id === selectedScan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{scan.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {scan.bodyPart} • {scan.date}
                      </p>
                    </div>
                    <Badge
                      variant={scan.status === 'analyzed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {scan.status}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
