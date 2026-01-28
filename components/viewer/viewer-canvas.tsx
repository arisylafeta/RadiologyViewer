'use client';

import { useEffect, useRef, useState } from 'react';
import {
  enableElement,
  disableElement,
  loadDicomImage,
  displayImage,
  buildWadoUri,
  type Image
} from '@/lib/dicom-loader';
import { AIOverlay } from './ai-overlay';
import { MRIAIOverlays } from './mri-ai-overlays';
import { mockAIAnalyses, getMRIOverlayData } from '@/lib/mock-data';

interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
  seriesId?: string;
  aiEnabled?: boolean;
}

export function ViewerCanvas({ scanId, sliceIndex, className, seriesId, aiEnabled = true }: ViewerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);

  // Initialize cornerstone element on mount
  useEffect(() => {
    const initElement = async () => {
      if (canvasRef.current) {
        try {
          await enableElement(canvasRef.current);
        } catch (err) {
          console.error('Error enabling element:', err);
          setError('Failed to initialize viewer');
        }
      }
    };

    initElement();

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

  // Load and display DICOM image when scanId or sliceIndex changes
  useEffect(() => {
    const loadAndDisplayImage = async () => {
      if (!canvasRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        // Build the wadouri image ID
        const imageId = buildWadoUri(scanId, sliceIndex, seriesId);

        // Load the DICOM image
        const image = await loadDicomImage(imageId);

        if (image) {
          // Display the image
          await displayImage(canvasRef.current, image);
          setCurrentImage(image);
        } else {
          setError(`Failed to load image for scan ${scanId}, slice ${sliceIndex}`);
        }
      } catch (err) {
        console.error('Error loading/displaying image:', err);
        setError('Error loading DICOM image');
      } finally {
        setIsLoading(false);
      }
    };

    loadAndDisplayImage();
  }, [scanId, sliceIndex]);

  // Get overlay data for current scan
  const aiAnalysis = mockAIAnalyses[scanId];
  const overlayData = aiAnalysis?.overlayData;
  const mriOverlayData = scanId?.startsWith('mri-') ? getMRIOverlayData(scanId) : [];

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
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-viewer-black/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-text-muted text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <p className="text-error mb-2">{error}</p>
              <p className="text-text-muted text-sm">
                Scan: {scanId}, Slice: {sliceIndex}
              </p>
            </div>
          </div>
        )}

        {/* Placeholder when no image loaded */}
        {!currentImage && !isLoading && !error && (
          <div className="flex items-center justify-center h-full text-text-muted">
            <p>DICOM Viewer - Scan: {scanId}, Slice: {sliceIndex}</p>
          </div>
        )}
      </div>

      {/* MRI AI Overlays */}
      {scanId?.startsWith('mri-') && (
        <MRIAIOverlays
          findings={mriOverlayData}
          width={dimensions.width}
          height={dimensions.height}
          visible={aiEnabled}
        />
      )}

      {/* Legacy AI Overlay for other modalities */}
      {!scanId?.startsWith('mri-') && (
        <AIOverlay
          overlayData={overlayData || []}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
}
