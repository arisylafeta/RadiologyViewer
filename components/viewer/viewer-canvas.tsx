'use client';

import { useEffect, useRef, useState } from 'react';
import { cornerstone } from '@/lib/cornerstone-init';
import { enableElement, disableElement } from '@/lib/dicom-loader';
import { AIOverlay } from './ai-overlay';
import { mockAIAnalyses } from '@/lib/mock-data';

interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
}

export function ViewerCanvas({ scanId, sliceIndex, className }: ViewerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });

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
    // Update dimensions when container size changes
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    // TODO: Load and display DICOM image based on scanId and sliceIndex
    // This will be implemented after adding real DICOM files
    console.log('Loading scan:', scanId, 'slice:', sliceIndex);
  }, [scanId, sliceIndex]);

  // Get overlay data for current scan
  const aiAnalysis = mockAIAnalyses[scanId];
  const overlayData = aiAnalysis?.overlayData;

  return (
    <div
      ref={containerRef}
      className={`relative bg-viewer-black ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <div
        ref={canvasRef}
        className="absolute inset-0"
      >
        {/* Cornerstone will render DICOM here */}
        <div className="flex items-center justify-center h-full text-text-muted">
          <p>DICOM Viewer - Scan: {scanId}, Slice: {sliceIndex}</p>
        </div>
      </div>

      {/* AI Overlay */}
      <AIOverlay
        overlayData={overlayData || []}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
