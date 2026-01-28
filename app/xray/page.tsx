'use client';

import { Suspense } from 'react';
import { ViewerLayout } from '@/components/viewer/viewer-layout';

function XRayPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">X-Ray Scans</h1>
        <p className="text-text-muted">
          Radiography analysis with AI-powered pathology detection
        </p>
      </div>

      <ViewerLayout modality="XRAY" />
    </div>
  );
}

export default function XRayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">Loading...</p>
        </div>
      </div>
    }>
      <XRayPageContent />
    </Suspense>
  );
}
