'use client';

import { useState } from 'react';
import { useViewerStore } from '@/lib/stores/viewer-store';

export type OverlayType = 'bounding-box' | 'segmentation' | 'heatmap' | 'detection-dot';

export interface OverlayData {
  type: OverlayType;
  coordinates: number[][];
  color: string;
  label: string;
  percentage?: number;
}

interface AIOverlayProps {
  overlayData: OverlayData[];
  width: number;
  height: number;
  className?: string;
}

export function AIOverlay({ overlayData, width, height, className }: AIOverlayProps) {
  const showAIOverlay = useViewerStore((state) => state.showAIOverlay);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  if (!showAIOverlay || !overlayData || overlayData.length === 0) {
    return null;
  }
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  const renderOverlay = (overlay: OverlayData, index: number) => {
    const { type, coordinates, color, label, percentage } = overlay;
    
    switch (type) {
      case 'bounding-box':
        return renderBoundingBox(coordinates as number[][], color, label, index);
      case 'segmentation':
        return renderSegmentation(coordinates as number[][], color, label, index);
      case 'heatmap':
        return renderHeatmap(coordinates as number[][], color, label, index);
      case 'detection-dot':
        return renderDetectionDot(coordinates as number[][], color, label, index, percentage);
      default:
        return null;
    }
  };
  
  const renderBoundingBox = (
    coords: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coords.length < 2) return null;
    
    const topLeft = coords[0];
    const bottomRight = coords[1];
    const x = topLeft[0];
    const y = topLeft[1];
    const rectWidth = bottomRight[0] - topLeft[0];
    const rectHeight = bottomRight[1] - topLeft[1];
    
    return (
      <g key={`bbox-${index}`}>
        <rect
          x={x}
          y={y}
          width={rectWidth}
          height={rectHeight}
          fill="none"
          stroke={color}
          strokeWidth={2}
          onMouseEnter={() => setHoveredLabel(label)}
          onMouseLeave={() => setHoveredLabel(null)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={x}
          y={y - 5}
          fill={color}
          fontSize={12}
          fontWeight={600}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      </g>
    );
  };
  
  const renderSegmentation = (
    coords: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coords.length < 3) return null;
    
    const points = coords.map((coord) => coord.join(',')).join(' ');
    
    return (
      <g key={`seg-${index}`}>
        <polygon
          points={points}
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth={2}
          onMouseEnter={() => setHoveredLabel(label)}
          onMouseLeave={() => setHoveredLabel(null)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={coords[0][0]}
          y={coords[0][1] - 5}
          fill={color}
          fontSize={12}
          fontWeight={600}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      </g>
    );
  };
  
  const renderHeatmap = (
    coords: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coords.length < 2) return null;
    
    const topLeft = coords[0];
    const bottomRight = coords[1];
    const x = topLeft[0];
    const y = topLeft[1];
    const rectWidth = bottomRight[0] - topLeft[0];
    const rectHeight = bottomRight[1] - topLeft[1];
    
    const gradientId = `heatmap-gradient-${index}`;
    
    return (
      <g key={`heatmap-${index}`}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </radialGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={rectWidth}
          height={rectHeight}
          fill={`url(#${gradientId})`}
          onMouseEnter={() => setHoveredLabel(label)}
          onMouseLeave={() => setHoveredLabel(null)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={x}
          y={y - 5}
          fill={color}
          fontSize={12}
          fontWeight={600}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      </g>
    );
  };

  const renderDetectionDot = (
    coords: number[][],
    color: string,
    label: string,
    index: number,
    percentage?: number
  ) => {
    if (coords.length < 1) return null;

    const x = coords[0][0];
    const y = coords[0][1];

    return (
      <g key={`dot-${index}`}>
        <circle
          cx={x}
          cy={y}
          r={20}
          fill={color}
          fillOpacity={0.2}
          stroke={color}
          strokeWidth={2}
          onMouseEnter={() => setHoveredLabel(`${label} (${percentage?.toFixed(0)}%)`)}
          onMouseLeave={() => setHoveredLabel(null)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={x}
          y={y + 4}
          fill={color}
          fontSize={11}
          fontWeight="bold"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {percentage?.toFixed(0)}
        </text>
        <text
          x={x}
          y={y - 28}
          fill={color}
          fontSize={10}
          fontWeight="600"
          textAnchor="middle"
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      </g>
    );
  };
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-auto"
        onMouseMove={handleMouseMove}
      >
        {overlayData.map((overlay, index) => renderOverlay(overlay, index))}
      </svg>
      
      {/* Tooltip */}
      {hoveredLabel && (
        <div
          className="absolute px-2 py-1 text-xs font-medium text-white bg-black/80 rounded pointer-events-none z-50"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}
