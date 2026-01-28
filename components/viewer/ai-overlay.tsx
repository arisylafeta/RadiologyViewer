'use client';

import { useState } from 'react';
import { useViewerStore } from '@/lib/stores/viewer-store';

export type OverlayType = 'bounding-box' | 'segmentation' | 'heatmap';

export interface OverlayData {
  type: OverlayType;
  coordinates: number[][];
  color: string;
  label: string;
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
    const { type, coordinates, color, label } = overlay;

    switch (type) {
      case 'bounding-box':
        return renderBoundingBox(coordinates, color, label, index);
      case 'segmentation':
        return renderSegmentation(coordinates, color, label, index);
      case 'heatmap':
        return renderHeatmap(coordinates, color, label, index);
      default:
        return null;
    }
  };

  const renderBoundingBox = (
    coordinates: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coordinates.length < 2) return null;

    const [topLeft, bottomRight] = coordinates;
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
    coordinates: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coordinates.length < 3) return null;

    const points = coordinates.map((coord) => coord.join(',')).join(' ');

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
          x={coordinates[0][0]}
          y={coordinates[0][1] - 5}
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
    coordinates: number[][],
    color: string,
    label: string,
    index: number
  ) => {
    if (coordinates.length < 2) return null;

    const [topLeft, bottomRight] = coordinates;
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
