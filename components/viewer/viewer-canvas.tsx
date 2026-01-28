'use client';

import { useEffect, useRef } from 'react';
import { cornerstone } from '@/lib/cornerstone-init';
import { enableElement, disableElement } from '@/lib/dicom-loader';

interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
}

export function ViewerCanvas({ scanId, sliceIndex, className }: ViewerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize cornerstone on mount
    // Cornerstone is already initialized in the module

    if (canvasRef.current) {
      enableElement(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        disableElement(canvasRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // TODO: Load and display DICOM image based on scanId and sliceIndex
    // This will be implemented after adding real DICOM files
    console.log('Loading scan:', scanId, 'slice:', sliceIndex);
  }, [scanId, sliceIndex]);

  return (
    <div
      ref={canvasRef}
      className={`bg-viewer-black ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Cornerstone will render DICOM here */}
      <div className="flex items-center justify-center h-full text-text-muted">
        <p>DICOM Viewer - Scan: {scanId}, Slice: {sliceIndex}</p>
      </div>
    </div>
  );
}
