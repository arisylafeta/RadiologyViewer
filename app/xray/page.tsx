'use client';

import { Suspense } from 'react';
import { ViewerLayout } from '@/components/viewer/viewer-layout';

function XRayPageContent() {
  return <ViewerLayout modality="XRAY" />;
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
