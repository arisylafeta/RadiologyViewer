import { ViewerLayout } from '@/components/viewer/viewer-layout';

export default function MRIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">MRI Scans</h1>
        <p className="text-text-muted">
          Magnetic Resonance Imaging analysis with AI assistance
        </p>
      </div>

      <ViewerLayout modality="MRI" />
    </div>
  );
}
