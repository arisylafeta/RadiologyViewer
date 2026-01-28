'use client';

import { useState } from 'react';
import { Scan, ScanModality } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Activity, Scan as ScanIcon, Bone } from 'lucide-react';

interface StudyBrowserProps {
  scans: Scan[];
  selectedScanId: string | null;
  onScanSelect: (scanId: string) => void;
  modality: ScanModality;
}

interface StudyHeaderProps {
  patientName: string;
  patientId: string;
  studyDate: string;
  modality: ScanModality;
}

interface SeriesThumbnailProps {
  scan: Scan;
  isActive: boolean;
  onClick: () => void;
  seriesNumber: number;
}

interface SeriesListProps {
  scans: Scan[];
  selectedScanId: string | null;
  onScanSelect: (scanId: string) => void;
  modality: ScanModality;
}

function getModalityIcon(modality: ScanModality) {
  switch (modality) {
    case 'MRI':
      return <Activity className="w-4 h-4" />;
    case 'CT':
      return <ScanIcon className="w-4 h-4" />;
    case 'XRAY':
      return <Bone className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
}

function StudyHeader({ patientName, patientId, studyDate, modality }: StudyHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 bg-[#1a1a1a]">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-primary/20 rounded">
          {getModalityIcon(modality)}
        </div>
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
          {modality}
        </span>
      </div>
      
      <h2 className="text-sm font-semibold text-text-primary mb-1 truncate">
        {patientName}
      </h2>
      
      <div className="space-y-0.5">
        <p className="text-xs text-text-muted">
          ID: {patientId}
        </p>
        <p className="text-xs text-text-muted">
          {new Date(studyDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}

function SeriesThumbnail({ scan, isActive, onClick, seriesNumber }: SeriesThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left transition-all duration-150 group',
        'hover:bg-white/5',
        isActive && 'bg-primary/10'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Active indicator bar */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-150',
            isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-white/20'
          )}
        />
        
        {/* Thumbnail placeholder */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              'w-20 h-20 rounded bg-[#1a1a1a] border-2 flex items-center justify-center transition-all duration-150',
              isActive
                ? 'border-primary shadow-[0_0_0_1px_rgba(37,99,235,0.3)]'
                : 'border-white/10 group-hover:border-white/20'
            )}
          >
            {/* Placeholder content */}
            <div className="flex flex-col items-center gap-1">
              {getModalityIcon(scan.modality)}
              <span className="text-[10px] text-text-muted">IMG</span>
            </div>
            
            {/* Series number badge */}
            <div className="absolute -top-1.5 -left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {seriesNumber}
            </div>
          </div>
        </div>
        
        {/* Series info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate mb-0.5">
            {scan.bodyPart}
          </p>
          <p className="text-xs text-text-muted truncate mb-1">
            {scan.modality} Series
          </p>
          <p className="text-xs text-text-muted/70">
            {scan.sliceCount} {scan.sliceCount === 1 ? 'image' : 'images'}
          </p>
        </div>
      </div>
    </button>
  );
}

function SeriesList({ scans, selectedScanId, onScanSelect }: Omit<SeriesListProps, 'modality'>) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-white/10">
      {/* Section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronRight className="w-4 h-4 text-text-muted" />
          )}
          <span className="text-sm font-medium text-text-primary">
            Series ({scans.length})
          </span>
        </div>
      </button>
      
      {/* Series items */}
      {isExpanded && (
        <div className="pb-2">
          {scans.map((scan, index) => (
            <SeriesThumbnail
              key={scan.id}
              scan={scan}
              seriesNumber={index + 1}
              isActive={selectedScanId === scan.id}
              onClick={() => onScanSelect(scan.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function StudyBrowser({
  scans,
  selectedScanId,
  onScanSelect,
  modality,
}: StudyBrowserProps) {
  // Get patient info from first scan (all scans should be from same patient in a study)
  const firstScan = scans[0];
  
  if (!firstScan) {
    return (
      <div className="w-[280px] h-full bg-[#0f0f0f] border-r border-white/10 flex items-center justify-center">
        <p className="text-sm text-text-muted">No scans available</p>
      </div>
    );
  }

  return (
    <div className="w-[280px] h-full bg-[#0f0f0f] border-r border-white/10 flex flex-col">
      {/* Study Header */}
      <StudyHeader
        patientName={firstScan.patientName}
        patientId={firstScan.patientId}
        studyDate={firstScan.date}
        modality={modality}
      />
      
      {/* Scrollable Series List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <SeriesList
          scans={scans}
          selectedScanId={selectedScanId}
          onScanSelect={onScanSelect}
        />
        
        {/* Additional sections can be added here */}
        <div className="p-3">
          <p className="text-xs text-text-muted/50 text-center">
            {scans.reduce((total, scan) => total + scan.sliceCount, 0)} total images
          </p>
        </div>
      </div>
    </div>
  );
}
