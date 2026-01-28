'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import {
  enableElement,
  disableElement,
  loadDicomImage,
  displayImage,
  buildWadoUri,
  type Image,
} from '@/lib/dicom-loader';
import { AIOverlay, OverlayData, OverlayType } from './ai-overlay';
import { MRIAIOverlays } from './mri-ai-overlays';
import { XRayAIOverlays } from './xray-ai-overlays';
import { CTAIOverlays } from './ct-ai-overlays';
import { mockAIAnalyses, mockScans, getMRIOverlayData, getXRayOverlayData, getCTOverlayData } from '@/lib/mock-data';
import { Maximize2, Move, Sun, ZoomIn } from 'lucide-react';

export interface ViewportProps {
  scanId: string;
  seriesId?: string;
  sliceIndex: number;
  totalSlices: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export function Viewport({
  scanId,
  seriesId,
  sliceIndex,
  totalSlices,
  isActive,
  onClick,
  className = '',
}: ViewportProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Get scan info for overlay
  const scan = mockScans.find((s) => s.id === scanId);
  const patientName = scan?.patientName || 'Unknown Patient';
  
  // Get descriptive series label for MRI
  const getSeriesLabel = (sid: string | undefined) => {
    if (!sid) return scan?.bodyPart || 'Unknown Series';
    if (sid.includes('s002')) return 'T2';
    if (sid.includes('s003')) return 'T1 SAG';
    if (sid.includes('s004')) return 'T1 SAG (2)';
    if (sid.includes('s005')) return 'STIR';
    if (sid.includes('s006')) return 'T1 COR';
    if (sid.includes('s001')) return 'Scout';
    return sid;
  };
  const seriesDescription = getSeriesLabel(seriesId);

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
        const imageId = buildWadoUri(scanId, sliceIndex, seriesId);
        const image = await loadDicomImage(imageId);

        if (image) {
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
  const overlayData = aiAnalysis?.overlayData || [];
  const mriOverlayData = scanId?.startsWith('mri-') ? getMRIOverlayData(scanId) : [];
  const xrayOverlayData = scanId === 's002' ? getXRayOverlayData(scanId) : [];
  const ctOverlayData = scanId?.startsWith('ct-') ? getCTOverlayData(scanId) : [];

  return (
    <div
      ref={containerRef}
      className={`
        relative bg-black overflow-hidden cursor-pointer
        border transition-all duration-150
        ${isActive ? 'border-2 border-[#2563eb] z-10' : 'border-[#333]'}
        ${className}
      `}
      style={{ width: '100%', height: '100%' }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cornerstone Canvas */}
      <div ref={canvasRef} className="absolute inset-0">
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-white/70 text-xs">Loading...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <p className="text-red-400 text-xs mb-1">{error}</p>
              <p className="text-white/50 text-xs">
                Scan: {scanId}, Slice: {sliceIndex}
              </p>
            </div>
          </div>
        )}

        {/* Placeholder when no image loaded */}
        {!currentImage && !isLoading && !error && (
          <div className="flex items-center justify-center h-full text-white/50">
            <p className="text-xs">No Image</p>
          </div>
        )}
      </div>

      {/* MRI AI Overlays */}
      {scanId?.startsWith('mri-') && (
        <MRIAIOverlays
          findings={mriOverlayData}
          width={dimensions.width}
          height={dimensions.height}
          visible={true}
        />
      )}

      {/* X-Ray AI Overlays */}
      {scanId === 's002' && (
        <XRayAIOverlays
          findings={xrayOverlayData}
          width={dimensions.width}
          height={dimensions.height}
          visible={true}
        />
      )}

      {/* CT AI Overlays */}
      {scanId?.startsWith('ct-') && (
        <CTAIOverlays
          findings={ctOverlayData}
          width={dimensions.width}
          height={dimensions.height}
          visible={true}
        />
      )}

      {/* Info Overlay - Top Left */}
      <div className="absolute top-0 left-0 p-2 z-20 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <p className="text-white text-xs font-medium truncate max-w-[150px]">
            {patientName}
          </p>
          <p className="text-white/70 text-[10px] truncate max-w-[150px]">
            {seriesDescription}
          </p>
          <p className="text-white/50 text-[10px]">
            Slice: {sliceIndex + 1} / {totalSlices}
          </p>
        </div>
      </div>

      {/* Toolbar on Hover */}
      {isHovered && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1.5">
            <button
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title="Window/Level"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Sun className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title="Zoom"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ZoomIn className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title="Pan"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Move className="w-3.5 h-3.5 text-white" />
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title="Maximize"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
