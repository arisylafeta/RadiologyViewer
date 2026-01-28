import { ViewerLayout } from '@/components/viewer/viewer-layout';

export default function CTPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">CT Scans</h1>
        <p className="text-text-muted">
          Computed Tomography analysis with AI-powered diagnostics
        </p>
      </div>

      <ViewerLayout modality="CT" />
    </div>
  );
}
