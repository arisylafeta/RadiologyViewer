'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ViewerLayout } from '@/components/viewer/viewer-layout';

function MRIPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Auto-select MRI shoulder scan if no scan specified
    if (!searchParams.get('scan')) {
      const params = new URLSearchParams();
      params.set('scan', 'mri-shoulder-001');
      router.push(`/mri?${params.toString()}`);
    }
  }, [searchParams, router]);

  return <ViewerLayout modality="MRI" />;
}

export default function MRIPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">Loading...</p>
        </div>
      </div>
    }>
      <MRIPageContent />
    </Suspense>
  );
}
